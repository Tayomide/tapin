document.getElementById('studentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    const name = document.getElementById('name').value;
    const studentA = document.getElementById('studentA').value;

    // In a real application, you would send this data to a server
    // to check the student's training status.

    // For this example, we'll just simulate the check.
    // Replace this with your actual logic.
    const hasRequiredTraining = Math.random() < 0.5; // 50% chance of having training

    if (hasRequiredTraining) {
        window.location.href = 'training_complete'; // Redirect to success page
    } else {
        window.location.href = 'training_needed'; // Redirect to training needed page
    }
});
