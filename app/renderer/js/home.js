import { createModal } from './modal.js'

window?.electronAPI.onCardInserted((uid) => {
  console.log('Card inserted:', uid)
  document.getElementById('uid').textContent = uid
})

window?.electronAPI.onCardRemoved(() => {
  console.log('Card removed')
  document.getElementById('uid').textContent = ''
})

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

// setTimeout(() => {
//   deleteModal()
// }, 1000)