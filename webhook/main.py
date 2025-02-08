"""
This module implements a Flask application that listens for GitHub webhook events
(push and pull request events) and forwards notifications to a Discord channel
via webhook.
It uses environment variables to configure the Discord webhook URL.
"""

import os
import requests
from flask import Flask, request
from dotenv import load_dotenv

load_dotenv()

discord_webhook_url = os.getenv("DISCORD_WEBHOOK_URL")

app = Flask(__name__)

@app.route("/")
def index():
  """
  Index route that returns a simple greeting message.

  Returns:
    str: The greeting message "Hello, World!".
  """
  return "Hello, World!"

@app.route("/webhook/github", methods=["POST"])
def github_webhook():
  """
  Handle incoming GitHub webhook events and route them to the appropriate handler.

  Extracts the event type from the request headers and processes the JSON
  payload based on whether the event is a 'push' or a 'pull_request'. If the
  event is unhandled, it prints a message.

  Returns:
    tuple: A tuple containing the response message "OK" and HTTP status code 200.
  """
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
  """
  Send a message to a Discord channel using a webhook.

  Constructs the payload with the provided message and additional information,
  then sends a POST request to the configured Discord webhook URL.

  Args:
    message (str): The message to send to Discord.
  """
  payload = {
    "content": message,
    "username": "GitHub",
    "avatar_url": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
  }
  requests.post(discord_webhook_url, json=payload, timeout=10)

def handle_push_event(payload):
  """
  Process a GitHub push event payload and send a notification to Discord.

  Extracts commit messages from the payload, formats them into a message, and
  sends the message via the Discord webhook. If there are no commits in the
  payload, no action is taken.

  Args:
    payload (dict): The JSON payload from a GitHub push event.
  """
  commit_messages = []
  if len(payload["commits"]) == 0:
    return
  for commit in payload["commits"]:
    original_message = commit["message"]
    commit_message = original_message.split("\n")[0]
    commit_messages.append(f"- [{commit_message}]({commit['url']})")
  commit_messages = "\n".join(commit_messages)
  message = (f"New GitHub commits:\n{commit_messages}\n"
             f"sent by [{payload['sender']['login']}]({payload['sender']['html_url']})")
  send_discord_message(message)

def handle_pull_request_event(payload):
  """
  Process a GitHub pull request event payload and send a notification to Discord.

  Based on the action performed (opened or closed), constructs a message
  detailing the pull request and sends the message via the Discord webhook.
  For a 'closed' pull request, it assumes the pull request was merged and
  includes information about the merger.

  Args:
    payload (dict): The JSON payload from a GitHub pull request event.
  """
  message = ""
  if payload["action"] == "opened":
    message = (
      f"New GitHub pull request: [{payload['pull_request']['title']}]"
      f"({payload['pull_request']['html_url']})\n"
      f"opened by [{payload['sender']['login']}]"
      f"({payload['sender']['html_url']})"
    )
  elif payload["action"] == "closed":
    message = (
      f"GitHub pull request: [{payload['pull_request']['title']}]"
      f"({payload['pull_request']['html_url']})\n"
      f"merged by [{payload['pull_request']['merged_by']['login']}]"
      f"({payload['pull_request']['merged_by']['html_url']})"
    )

  if len(message) > 0:
    send_discord_message(message)

if __name__ == "__main__":
  app.run(port=5000)
