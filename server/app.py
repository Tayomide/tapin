from fastapi import FastAPI, Response, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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