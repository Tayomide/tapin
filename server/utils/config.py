import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_HOST=os.getenv("DATABASE_HOST")
DATABASE_USER=os.getenv("DATABASE_USER")
DATABASE_PASSWORD=os.getenv("DATABASE_PASSWORD")
DATABASE_NAME=os.getenv("DATABASE_NAME")
CLIENT_ID=os.getenv("OAUTH_CLIENT_ID")
CLIENT_SECRET=os.getenv("OAUTH_CLIENT_SECRET")
REDIRECT_URI=os.getenv("OAUTH_REDIRECT_URI")
SECRET_KEY=os.getenv("SECRET_KEY")
EXPIRES_IN=int(os.getenv("EXPIRES_IN", 3600))
PORT=int(os.getenv("PORT", 8000))