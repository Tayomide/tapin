from typing import Optional
from pydantic import BaseModel, Field


class AssignTraining(BaseModel):
  user_id: Optional[str] = None
  user_email: Optional[str] = None
  training_id: str
  status: str  # Should be "not_assigned", "started", or "completed"
