const form = document.querySelector("form")

form.addEventListener("submit", createTraining)

async function createTraining(event) {
  event.preventDefault();
  const button = event.target.querySelector("button[type='submit']");
  button.disabled = true; // Disable it immediately
  button.classList.add("disabled"); // Optional: for better visual feedback

  try {
    const id = document.getElementById("training").value;
    const email = document.getElementById("email").value
    const status = document.getElementById("status").value
  
    const response = await fetch("/api/create-training", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ training_id: id, user_email: email, status })
    });
  
    const result = await response.json();
    if (result.success) {
      alert("Training created successfully!");
      window.location.href = "/";  // Redirect home or wherever you want
    } else {
      alert("Error: " + (result.error || "Could not create training."));
    }
  } catch (error) {
    console.error(error);
    alert("An unexpected error occurred.");
  } finally {
    button.disabled = false; // Re-enable after the process is done (success or fail)
    button.classList.remove("disabled"); // Remove the 'disabled' style
  }
}

fetch("/api/trainings", {
  headers: {
    credentials: 'include', // Send cookies with the request
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(result => {
  const training_input = document.getElementById("training")
  const trainings = result.trainings
  const options = [`<option value="">Select a training...</option>`]
  trainings.map(training => {
    options.push(`<option value="${training.id}">${training.name}</option>`)
  })
  training_input.innerHTML = options.join("\n")
})