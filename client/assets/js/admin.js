document.getElementById('adminForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting in the traditional way

  // Always redirect to the training complete page
  window.location.href = 'training_complete';
});
