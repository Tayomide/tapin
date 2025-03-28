from pydantic import BaseModel

class DeleteSession(BaseModel):
  session_id: str