import { createModal } from './modal.js'
import { fetchWithAuth } from './fetch.js'

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
  fetchWithAuth(`/create-card-session?hashed_a_number=${cardHex}&device_name=${device_info}`)
  .then(async response => {
    if (!response.ok) createModal(cardHex)
    else {
      const data = await response.json()
      console.log("Success:", data)
      await window?.electronAPI.setToken(data.session_token)
      // redirect to welcome page
      window.location.href = 'index.html'
    }
  })
  .catch(error => {
    createModal(cardHex)
    console.log("Error: ", error)
  })
}

const currentPath = window.location.pathname.replace(/^\/+|\/+$/g, '')

const button = document.getElementById("hamburger-menu")

function toggleMenu() {
  var sidebar = document.getElementById("sidebar");
  if (sidebar.style.width === "300px") {
    sidebar.style.width = "0";
  } else {
    sidebar.style.width = "300px";
  }
}

button.addEventListener("click", toggleMenu)

const navLinks = document.querySelectorAll("#sidebar a");

navLinks.forEach(link => {
  const linkPath = link.getAttribute("href").replace(/^\/+|\/+$/g, '');
  if (linkPath === currentPath) {
    link.classList.add("current-page");
  }
});