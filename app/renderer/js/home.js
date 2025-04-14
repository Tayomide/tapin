import { createModal } from './modal.js'

window?.electronAPI.onCardInserted(async (uid) => {
  console.log('Card inserted:', uid)
  const hashedCardHex = await window?.electronAPI.hashHex(uid)
  const deviceInfo = await window?.electronAPI.getDeviceInfo()

  createSession(hashedCardHex, deviceInfo)
})

window?.electronAPI.onCardRemoved(() => {
  console.log('Card removed')
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
      window.location.href = 'welcome.html'
    }
  })
  .catch(error => {
    createModal(cardHex)
    console.log("Error: ", error)
  })
}