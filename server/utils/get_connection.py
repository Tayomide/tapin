from mysql import connector
from utils.config import (
  DATABASE_HOST as host,
  DATABASE_USER as user,
  DATABASE_PASSWORD as password
)

def get_connection():
  return connector.connect(
    host=host,
    user=user,
    password=password,
    port="3306"
  )
