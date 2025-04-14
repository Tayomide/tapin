import { createModal } from './modal.js'
import { fetchWithAuth } from './fetch.js'

window?.electronAPI.onCardInserted((uid) => {
  console.log('Card inserted:', uid)
  document.getElementById('uid').textContent = uid
})

window?.electronAPI.onCardRemoved(() => {
  console.log('Card removed')
  document.getElementById('uid').textContent = ''
})

const linkCard = (cardHex, email) => {
  // TODO: Change this to https://system61.rice.iit.edu/server/link_a_number
  // TODO: Remove Content-Security-Policy header when replacing with https
  fetch("https://system61.rice.iit.edu/server/is_logged_in")
  .then(response => {
    if(!response.ok)throw new Error("Network response was not ok")
    return response.json()
  })
  .then(data => {
    console.log("Success:", data)
  })
  .catch(error => {
    console.log("Error: ", error)
  })
  // fetch("http://localhost:8000/link_a_number", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Content-Security-Policy": "default-src 'self'; connect-src 'self'",
  //   },
  //   body: JSON.stringify({
  //     hashed_a_number: cardHex,
  //     email,
  //     device_name: "Nintendo Switch"
  //   })
  // })
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error('Network response was not ok')
  //   }
  //   return response.json()
  // })
  // .then(data => {
  //   console.log("Success:", data)
  // })
  // .catch(error => {
  //   console.error("Error:", error)
  // })
}

const loginWithCard = (cardHex) => {
  const hashedCardHex = window?.electronAPI.hashHex(cardHex)
  fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cardHex: cardHex,
      hashedCardHex
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  .then(data => {
    console.log("Success:", data)
  })
  .catch(error => {
    console.error("Error:", error)
  })
}



createModal()

document.getElementById('test-button').addEventListener("click", () => {
  linkCard("5434rtg453g53rg435434", "tibrahim@hawk.iit.edu")
})

// setTimeout(() => {
//   deleteModal()
// }, 1000)