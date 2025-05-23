import os
import requests
import jwt
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from jwt import PyJWTError
from models.assign_training import AssignTraining  # You'll need to create this simple Pydantic model
from models.delete_session import DeleteSession
from utils.config import (
  DATABASE_NAME as database,
  CLIENT_ID as client_id,
  CLIENT_SECRET as client_secret,
  REDIRECT_URI as redirect_uri,
  SECRET_KEY as secret_key,
  PORT,
)

from utils.create_session import create_db_session, create_card_session as create_csession
from utils.get_connection import get_connection

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["https://70d9-2620-f3-8000-5050-42-a658-b52f-b35b.ngrok-free.app"],  # You can restrict this to your ngrok URL or client domain
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
  auth: str = request.headers.get("Authorization")
  if auth and auth.lower().startswith("bearer "):
    token = auth[7:]
    try:
      payload = jwt.decode(token, secret_key, algorithms=["HS256"])
      session_id = payload.get("session_id")
    except PyJWTError:
      session_id = None
    
    if session_id is not None:
      mydb = get_connection()
      cursor = mydb.cursor()
      cursor.execute(f"USE {database};")
      cursor.execute("""
        SELECT 
          sessions.session_id, sessions.user_id, sessions.user_device, sessions.expires_in, sessions.updated_at, users.is_admin
        FROM sessions
        JOIN users ON sessions.user_id = users.id
        WHERE sessions.session_id = %s
      """, (session_id,))

      session_tup = cursor.fetchone()
      if session_tup is not None:
        (session_id, user_id, user_device, expires_in, updated_at, is_admin) = session_tup
        updated_at = updated_at.replace(tzinfo=timezone.utc)
        expiration_time = updated_at + timedelta(seconds=expires_in)
        # Get current time using datetime
        if datetime.now(timezone.utc) < expiration_time:
          request.state.session_valid = True
          request.state.session_data = {
            "session_id": session_id,
            "user_id": user_id,
            "user_device": user_device,
            "expires_in": expires_in,
            "is_admin": bool(is_admin)  # Make sure it's True/False (tinyint(1) in MySQL)
          }
          # Update updated_at to extend the sliding window
          cursor.execute(
            "UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE session_id = %s;",
            (session_id,)
          )
          # Commit the transaction to apply the changes
          mydb.commit()

      cursor.close()
      mydb.close()


  try:
    value = request.state.session_valid
  except AttributeError:
    # Learnt from Karl Stolley
    request.state.session_valid = False
  response = await call_next(request)

  return response 

@app.get("/")
async def root(request: Request):
  if request.state.session_valid:
    return {"message": "Hello World", "session": request.state.session_data}
  return {"message": "Hello World"}

@app.get("/create-card-session")
async def create_card_session(hashed_a_number: str, device_name: str):
  try:
    session_id = create_csession(hashed_a_number, device_name)
  except Exception as exc:
    return JSONResponse(
      content={
        "error": "Could not create a session in database"
      },
      status_code=400
    )

  if session_id is None:
    return JSONResponse(
      content={
        "error": f"User with hashed A Number: {hashed_a_number} does not exist"
      },
      status_code=400
    )
  else:
    payload = {
      "session_id": session_id
    }
    session_token = jwt.encode(payload, secret_key, algorithm="HS256")
    return JSONResponse(
      content={
        "session_token": session_token,
        "message": "User has been authenticated"
      },
      status_code=200
    )

@app.get("/link-a-number")
async def link_a_number(hashed_a_number: str, email: str):
  
  mydb = get_connection()
  cursor = mydb.cursor()

  cursor.execute(f"USE {database};")
  # Set hashed_a_number for user with email
  cursor.execute(
    "UPDATE users SET hashed_a_number = %s WHERE email = %s",
    (hashed_a_number, email)
  )
  mydb.commit()

  cursor.close()
  mydb.close()

  return JSONResponse(
    content={
      "message": "A number has been linked to the user"
    },
    status_code=200
  )

@app.get("/set-cookie")
async def set_cookie(response: Response):
  # Set a cookie with SameSite=None and Secure flags
  response.set_cookie(
    key="my_cookie", 
    value="cookie_value", 
    samesite="None",  # Ensure it works cross-site
    secure=True,      # Ensure it's sent only over HTTPS
    httponly=False,    # Optional: helps with security by preventing JS access
    max_age=3600      # Optional: expires in 1 hour
  )
  return JSONResponse(content={"message": "Cookie set!"})

@app.get("/create-session")
async def create_session(code: str, device_name: str):
  url = "https://oauth2.googleapis.com/token"
  payload = {
    "client_id": client_id,
    "client_secret": client_secret,
    "code": code,
    "redirect_uri": redirect_uri,
    "grant_type": "authorization_code"
  }
  headers = {
    "Content-Type": "application/json"
  }

  try:
    response = requests.post(url, json=payload, headers=headers)
    # response.raise_for_status()  # Raise an error for HTTP codes 4xx/5xx
    token_response = response.json()

    id_token = token_response["id_token"]
    decoded = jwt.decode(id_token, options={"verify_signature": False})
    email = decoded["email"]

    try:
      session_id = create_db_session(email, device_name)
    except Exception as exc:
      return JSONResponse(
        content={
          "error": "Could not create a session in database"
        },
        status_code=400
      )

    if session_id is None:
      return JSONResponse(
        content={
          "error": f"User with email: {email} does not exist"
        },
        status_code=400
      )
    else:
      payload = {
        "session_id": session_id
      }
      session_token = jwt.encode(payload, secret_key, algorithm="HS256")
      return JSONResponse(
        content={
          "session_token": session_token,
          "message": "User has been authenticated"
        },
        status_code=200
      )
  except requests.exceptions.RequestException as e:
    return JSONResponse(
      content={
        "error": f"Error fetching token: {e}"
      },
      status_code=400
    )

@app.get("/get-cookie")
async def get_cookie(request: Request):
  # Retrieve the cookie from the request
  cookie_value = request.cookies.get("my_cookie", "Cookie not found")
  return {"cookie_value": cookie_value}

@app.get("/is_logged_in")
async def is_logged_in(request: Request):
  return JSONResponse({
    "is_logged_in": request.state.session_valid
  })

@app.get("/get_user")
async def get_user(request: Request):
  if not request.state.session_valid:
    return JSONResponse({
      "user": None
    })
  user_id = request.state.session_data["user_id"]
  mydb = get_connection()
  cursor = mydb.cursor()
  cursor.execute(f"USE {database};")
  cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
  
  user_tup = cursor.fetchone()
  if user_tup is None:
    return JSONResponse({
      "user": None
    })
  (user_id, hashed_a_number, email, is_admin, created_at, updated_at) = user_tup
  cursor.close()
  mydb.close()

  return JSONResponse({
    "user": {
      "user_id": user_id,
      "email": email,
      "is_admin": is_admin,
      "hashed_a_number": hashed_a_number,
      "created_at": str(created_at),
      "updated_at": str(updated_at)
    }
  })

@app.get("/sessions")
async def get_sessions(request: Request):
  if not request.state.session_valid:
    return JSONResponse({
      "sessions": []
    })
  user_id = request.state.session_data["user_id"]
  mydb = get_connection()
  cursor = mydb.cursor()
  cursor.execute(f"USE {database};")
  cursor.execute("SELECT * FROM sessions WHERE user_id = %s", (user_id,))

  session_tup = cursor.fetchall()
  if session_tup is None:
    return JSONResponse({
      "sessions": []
    })
  sessions = []
  for (session_id, user_id, user_device, expires_in, created_at, updated_at) in session_tup:
    sessions.append({
      "session_id": session_id,
      "user_id": user_id,
      "device": user_device,
      "expires_in": expires_in,
      "created_at": str(created_at),
      "updated_at": str(updated_at),
      "current_session": session_id == request.state.session_data["session_id"]
    })
  cursor.close()
  mydb.close()
  return JSONResponse({
    "sessions": sessions
  })

@app.delete("/session")
async def delete_session(delete_session: DeleteSession):
  try:
    session_id = delete_session.session_id
    if not session_id:
      return JSONResponse(
        content={"error": "Session ID is required"},
        status_code=400
      )
    mydb = get_connection()
    cursor = mydb.cursor()
    cursor.execute(f"USE {database};")
    cursor.execute("DELETE FROM sessions WHERE session_id = %s", (session_id,))
    mydb.commit()
    cursor.close()
    mydb.close()

    return JSONResponse(
      content={"message": "Session deleted successfully", "deleted": True},
      status_code=200
    )
  except Exception as e:
    print(e)
    return JSONResponse(
      content={"error": f"An error occurred: {str(e)}"},
      status_code=500
    )

@app.get("/trainings")
async def get_trainings(request: Request):
  if not request.state.session_valid:
    return JSONResponse({"trainings": []})
  
  mydb = get_connection()
  cursor = mydb.cursor()
  cursor.execute(f"USE {database};")

  query = """
    SELECT training_id, name
    FROM trainings;
  """

  cursor.execute(query)
  training_records = cursor.fetchall()

  trainings = []
  for (training_id, name) in training_records:
    trainings.append({
      "name": name,
      "id": training_id
    })
  
  cursor.close()
  mydb.close()
  return JSONResponse({"trainings": trainings})


@app.get("/user_trainings")
async def get_user_trainings(request: Request):
  if not request.state.session_valid:
    return JSONResponse({"trainings": []})
  
  user_id = request.state.session_data["user_id"]
  mydb = get_connection()
  cursor = mydb.cursor()
  cursor.execute(f"USE {database};")

  query = """
    SELECT trainings.name, trainings.description, user_trainings.status, user_trainings.assigned_at, user_trainings.completed_at
    FROM user_trainings
    JOIN trainings ON user_trainings.training_id = trainings.training_id
    WHERE user_trainings.user_id = %s;
  """
  cursor.execute(query, (user_id,))
  training_records = cursor.fetchall()

  trainings = []
  for (name, description, status, assigned_at, completed_at) in training_records:
    trainings.append({
      "name": name,
      "description": description,
      "status": status,
      "assigned_at": str(assigned_at),
      "completed_at": str(completed_at) if completed_at else None
    })
  
  cursor.close()
  mydb.close()
  return JSONResponse({"trainings": trainings})

@app.get("/is_admin")
async def is_admin(request: Request):
  if not request.state.session_valid:
    return JSONResponse({"is_admin": False})

  return JSONResponse({"is_admin": request.state.session_data["is_admin"]})

@app.post("/assign_training")
async def assign_training(request: Request, assign_training: AssignTraining):
  if not request.state.session_valid:
    return JSONResponse({"error": "Authentication required"}, status_code=401)

  # Check if current user is admin
  if not request.state.session_data["is_admin"]:
    return JSONResponse({"error": "Admin privileges required"}, status_code=403)
  
  mydb = get_connection()
  cursor = mydb.cursor()
  cursor.execute(f"USE {database};")

  # Determine target user
  if assign_training.user_id:
    target_user_id = assign_training.user_id
  elif assign_training.user_email:
    # Lookup user_id from email
    cursor.execute("SELECT id FROM users WHERE email = %s", (assign_training.user_email,))
    result = cursor.fetchone()
    if result is None:
      cursor.close()
      mydb.close()
      return JSONResponse({"error": "User with provided email not found"}, status_code=404)
    target_user_id = result[0]
  else:
    cursor.close()
    mydb.close()
    return JSONResponse({"error": "You must provide either user_id or email"}, status_code=400)

  training_id = assign_training.training_id
  status = assign_training.status

  # Upsert: update if exists, insert if not
  cursor.execute("""
    INSERT INTO user_trainings (user_id, training_id, status)
    VALUES (%s, %s, %s)
    ON DUPLICATE KEY UPDATE status = VALUES(status),
                            assigned_at = CURRENT_TIMESTAMP,
                            completed_at = CASE WHEN VALUES(status) = 'completed' THEN CURRENT_TIMESTAMP ELSE NULL END
  """, (target_user_id, training_id, status))

  mydb.commit()
  cursor.close()
  mydb.close()

  return JSONResponse({"success": True, "message": "Training assigned/updated successfully"})

    
if __name__ == "__main__":
  import uvicorn
  ssl_folder = "/workspace/ssl"
  if os.path.isdir(ssl_folder):
    uvicorn.run(
      "app:app",
      host="0.0.0.0",  # Listen on all interfaces
      port=PORT,       # Specify the port
      reload=True,
      ssl_certfile="/workspace/ssl/devcontainer.crt",  # Path to your certificate
      ssl_keyfile="/workspace/ssl/devcontainer.key"    # Path to your private key
    )
  else:
    uvicorn.run("app:app", host="0.0.0.0", port=PORT, reload=True)