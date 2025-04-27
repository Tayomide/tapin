import { fetchWithAuth } from "./fetch.js"

fetchWithAuth("/user_trainings", {
  headers: {
    credentials: 'include', // Send cookies with the request
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(result => {
  const trainings = result.trainings
  // <div class="training-card in-progress">
  //   <div class="training-status">In-Progress</div>
  //   <div class="training-title">Safety Contact#</div>
  // </div>
  const divList = []
  trainings.map(training => {
    divList.push(`
      <div class="training-card ${training.status}">
        <div class="training-status">${training.status}</div>
        <div class="training-title">${training.name}</div>
      </div>
    `)
  })

  const trainingGrid = document.querySelector(".training-grid")
  trainingGrid.innerHTML = divList.join("\n")
})