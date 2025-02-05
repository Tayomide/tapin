import requests
from flask import Flask, request

app = Flask(__name__)


@app.route("/")
def index():
  return "Hello, World!"

@app.route("/webhook/github", methods=["POST"])
def github_webhook():
  data = request.json
  print(data)
  # commit_messages = "\n".join(
  #   [commit["message"] for commit in data["commits"]]
  # )
  # basecamp_payload = {
  #     "content": f"New GitHub commits:\n{commit_messages}",
  # }
  # headers = {"Authorization": "Bearer YOUR_BASECAMP_ACCESS_TOKEN"}
  # response = requests.post(
  #     "https://3.basecampapi.com/YOUR_ACCOUNT_ID/messages",
  #     json=basecamp_payload,
  #     headers=headers,
  # )
  return "Testing webhook", 200

if __name__ == "__main__":
  app.run(port=5000)