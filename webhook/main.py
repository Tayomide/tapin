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
    [f"[{commit["message"]}]({commit['url']})" for commit in payload["commits"]]
  )
  message = f"New GitHub commits:\n{commit_messages}\n" + f"from [{payload['pusher']['name']}](https://github.com/{payload['pusher']['name']})"
  send_discord_message(message)

def handle_pull_request_event(payload):
  message = f"New GitHub pull request: [{payload['pull_request']['title']}](https://github.com/{payload['repository']['full_name']}/pull/{payload['pull_request']['number']})\n" + f"from [{payload['pull_request']['user']['login']}](https://github.com/{payload['pull_request']['user']['login']})"

  send_discord_message(message)

if __name__ == "__main__":
  app.run(port=5000)