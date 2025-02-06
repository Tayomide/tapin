import requests, os
from flask import Flask, request
from dotenv import load_dotenv

load_dotenv()

discord_webhook_url = os.getenv("DISCORD_WEBHOOK_URL")


app = Flask(__name__)


@app.route("/")
def index():
  return "Hello, World!"

@app.route("/webhook/github", methods=["POST"])
def github_webhook():
  event_type = request.headers.get('X-GitHub-Event')
  payload = request.json  # The JSON payload containing the event data

  if event_type == 'push':
      handle_push_event(payload)
  elif event_type == 'pull_request':
    handle_pull_request_event(payload)
  else:
    print(f"Unhandled event: {event_type}")

  return "OK", 200

def send_discord_message(message):
  payload = {
    "content": message,
  }
  requests.post(discord_webhook_url, json=payload)

def handle_push_event(payload):
  commit_messages = "\n".join(
    [f"- [{commit["message"]}]({commit['url']})" for commit in payload["commits"]]
  )
  message = f"New GitHub commits:\n{commit_messages}\n" + f"sent by [{payload['sender']['login']}]({payload['sender']['url']})"
  send_discord_message(message)

def handle_pull_request_event(payload):
  if(payload["action"] == "opened"):
    message = f"New GitHub pull request: [{payload['pull_request']['title']}]({payload['pull_request']['url']})\n" + f"opened by [{payload['sender']['login']}]({payload['sender']['url']})"
  elif(payload["action"] == "closed"):
    message = f"GitHub pull request: [{payload['pull_request']['title']}]({payload['pull_request']['url']})\n" + f"merged by [{payload['pull_request']['merged_by']['login']}]({payload['pull_request']['merged_by']['url']})"

  send_discord_message(message)

if __name__ == "__main__":
  app.run(port=5000)