import { fetchWithAuth } from './fetch.js'

window.addEventListener('DOMContentLoaded', async () => {

  console.log(window.electronAPI)

  const h1 = document.querySelector('main h1');
  
  
  fetchWithAuth("https://system61.rice.iit.edu/server/get_user")
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok')
    return response.json()
  }).then(data => {
    console.log(data)
    h1.innerText = `Welcome ${data.email}`
  })

})