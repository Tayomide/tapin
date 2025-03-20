import os
from dotenv import load_dotenv
from fastapi import FastAPI, Response, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

PORT = int(os.getenv("PORT", 8000))

app.add_middleware(
  CORSMiddleware,
  allow_origins=["https://70d9-2620-f3-8000-5050-42-a658-b52f-b35b.ngrok-free.app"],  # You can restrict this to your ngrok URL or client domain
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/")
async def root():
  return {"message": "Hello World"}

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

@app.get("/get-cookie")
async def get_cookie(request: Request):
  # Retrieve the cookie from the request
  cookie_value = request.cookies.get("my_cookie", "Cookie not found")
  print(cookie_value, request.cookies)
  return {"cookie_value": cookie_value}


if __name__ == "__main__":
  import uvicorn
  ssl_folder = "/workspace/ssl"
  if os.path.isdir(ssl_folder):
    uvicorn.run(
      app,
      host="0.0.0.0",  # Listen on all interfaces
      port=PORT,       # Specify the port
      ssl_certfile="/workspace/ssl/devcontainer.crt",  # Path to your certificate
      ssl_keyfile="/workspace/ssl/devcontainer.key"    # Path to your private key
    )
  else:
    uvicorn.run(app, host="0.0.0.0", port=PORT)