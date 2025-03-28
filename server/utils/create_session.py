import os
from dotenv import load_dotenv

load_dotenv()

expires_in = int(os.getenv("EXPIRES_IN"))

def create_db_session(mydb, email, device):
  # Create cursor
  cursor = mydb.cursor()
  cursor.execute("USE posts;")

  # SQL query to insert session with RETURNING clause
  insert_query = """
  INSERT INTO sessions (user_id, user_device, expires_in)
  SELECT u.id, %s, %s
  FROM users u
  WHERE u.email = %s
  RETURNING session_id;
  """
  # TODO: Return user id too, easier for queries
  # Or maybe don't?

  # Execute the query and fetch the session_id
  cursor.execute(insert_query, (device, expires_in, email))

  # Fetch the session_id from the result of the insert operation
  session_id = cursor.fetchone()

  # Commit changes and close connection
  mydb.commit()
  cursor.close()

  return session_id if session_id is None else session_id[0]