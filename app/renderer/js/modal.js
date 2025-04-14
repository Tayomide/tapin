const createModal = (cardHex) => {
  const modal = document.createElement('div')
  modal.classList.add('modal')

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      deleteModal(modal)
    }
  })

  const modalContent = document.createElement('div')
  modalContent.classList.add('modal-content')

  const h2 = document.createElement('h2')
  h2.textContent = 'Link Card'

  const p1 = document.createElement('p')
  p1.textContent = 'Your hashed card ID doesn\'t exist in the database.'

  const p2 = document.createElement('p')
  p2.textContent = 'Would you like to link it?'

  const input = document.createElement('input')
  input.type = 'text'
  input.id = 'card-id'
  input.placeholder = 'Enter your hawk email here'

  const modalButtons = document.createElement('div')
  modalButtons.classList.add('modal-buttons')

  const cancelLink = document.createElement('button')
  cancelLink.id = 'cancel-link'
  cancelLink.textContent = 'Cancel'
  cancelLink.addEventListener('click', (e) => {
    e.stopPropagation() // Prevent the click event from bubbling up to the modal
    deleteModal(modal)
  })

  const linkCard = document.createElement('button')
  linkCard.id = 'link-card'
  linkCard.textContent = 'Link'
  linkCard.addEventListener('click', async (e) => {
    e.stopPropagation() // Prevent the click event from bubbling up to the modal
    await linkCardFunc(cardHex, input.value)
    deleteModal(modal)
  })

  modalButtons.appendChild(cancelLink)
  modalButtons.appendChild(linkCard)

  modalContent.appendChild(h2)
  modalContent.appendChild(p1)
  modalContent.appendChild(p2)
  modalContent.appendChild(input)
  modalContent.appendChild(modalButtons)

  modal.appendChild(modalContent)

  document.body.appendChild(modal)
}

async function linkCardFunc(cardHex, email) {
  await fetch(`https://system61.rice.iit.edu/server/link-a-number?hashed_a_number=${cardHex}&email=${email}`)
  .then(console.log)
  .catch(console.log)
}

const deleteModal = (modal) => {
  if (modal) {
    modal.remove()
    modal = null
  }
}

// Export the functions to be used in other files
export { createModal, deleteModal }