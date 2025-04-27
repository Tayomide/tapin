import { fetchWithAuth } from "./fetch.js"

const sessionContainer = document.querySelector("#sessions-container")

function getTimeSpent(milliseconds){
  const seconds = milliseconds / 1000
  if(seconds < 60)return `${Math.floor(seconds)} second${seconds >= 2 ? "s" : ""}`
  const minutes = seconds / 60
  if(minutes < 60)return `${Math.floor(minutes)} minute${minutes >= 2 ? "s" : ""}`
  const hours = minutes / 60
  if(hours < 24)return `${Math.floor(hours)} hour${hours >= 2 ? "s" : ""}`
  const days = hours / 24
  return `${Math.floor(days)} days`
}

fetchWithAuth("/sessions", {
  headers: {
    credentials: 'include', // Send cookies with the request
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(sessions => {
  console.log(sessions)
  for (const session of sessions.sessions) {
    const milliseconds = new Date() - new Date(session.created_at + "Z")
    const status = `Logged in ${getTimeSpent(milliseconds)} ago`
  
    const li = document.createElement("li");
    
    li.innerHTML = `
      <p class="device-name">${session.device}</p>
      <p class="status">${status}</p>
    `;
  
    if (!session.current_session) {
      const button = document.createElement("button");
      button.className = "btn";
      button.textContent = "Log out";
  
      // ✅ Add event listener instead of inline onclick
      button.addEventListener("click", () => {
        logout(session.session_id);
      });
  
      li.appendChild(button);
    }
  
    li.classList.add(session.session_id);
    sessionContainer.appendChild(li);
  }  
})
.catch(error => console.error("Error fetching sessions:", error));

function logout(sessionId){
  const li = document.querySelector(`[class="${sessionId}"]`)
  li.remove()
  fetchWithAuth("/session", {
    method: "DELETE",
    headers: {
      credentials: 'include', // Send cookies with the request
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      session_id: sessionId
    })
  }).then(res => res.json())
  .then(console.log)
  .catch(console.log)
}