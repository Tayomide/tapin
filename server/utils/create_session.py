from utils.config import DATABASE_NAME as database, EXPIRES_IN as expires_in
from utils.get_connection import get_connection

def create_db_session(email, device):
  mydb = get_connection()
  # Create cursor
  cursor = mydb.cursor()
  cursor.execute(f"USE {database};")

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
  mydb.close()

  return session_id if session_id is None else session_id[0]

def create_card_session(hashed_a_number, device):
  mydb = get_connection()
  # Create cursor
  cursor = mydb.cursor()
  cursor.execute(f"USE {database};")

  # SQL query to insert session with RETURNING clause
  insert_query = """
  INSERT INTO sessions (user_id, user_device, expires_in)
  SELECT u.id, %s, %s
  FROM users u
  WHERE u.hashed_a_number = %s
  RETURNING session_id;
  """
  # TODO: Return user id too, easier for queries
  # Or maybe don't?

  # Execute the query and fetch the session_id
  cursor.execute(insert_query, (device, expires_in, hashed_a_number))

  # Fetch the session_id from the result of the insert operation
  session_id = cursor.fetchone()

  # Commit changes and close connection
  mydb.commit()
  cursor.close()
  mydb.close()

  return session_id if session_id is None else session_id[0]
