import { createModal } from './modal.js'
import { fetchWithAuth } from './fetch.js'

const updateH1 = () => {
  const h1 = document.querySelector('main h1');
  
  fetchWithAuth("https://system61.rice.iit.edu/server/get_user")
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok')
    return response.json()
  }).then(data => {
    console.log(data)
    h1.innerText = `Welcome ${data.user?.email}`
  })
}

window.addEventListener('DOMContentLoaded', async () => {
  updateH1()
})


window?.electronAPI.onCardInserted(async (uid) => {
  console.log('Card inserted:', uid)
  const hashedCardHex = await window?.electronAPI.hashHex(uid)
  const deviceInfo = await window?.electronAPI.getDeviceInfo()

  createSession(hashedCardHex, deviceInfo)
})

function createSession (cardHex, device_info) {
  fetch(`https://system61.rice.iit.edu/server/create-card-session?hashed_a_number=${cardHex}&device_name=${device_info}`)
  .then(async response => {
    if (!response.ok) createModal(cardHex)
    else {
      const data = await response.json()
      console.log("Success:", data)
      await window?.electronAPI.setToken(data.session_token)
      // redirect to welcome page
      updateH1()
    }
  })
  .catch(error => {
    createModal(cardHex)
    console.log("Error: ", error)
  })
}