from pydantic import BaseModel

# TODO: Add descriptions and docstrings

class LinkANumber(BaseModel):
  hashed_a_number: str
  email: str