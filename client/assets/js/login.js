document.getElementById("studentSubmit").onclick = function validateForm() {
  const containsA = /A/g;
  const containsEightNum = /\d{8}/g;

  const sName = document.forms["studentForm"]["studentName"].value;
  const sId = document.forms["studentForm"]["studentId"].value;
  if (sName == "") {
    const errorField = document.getElementById("error");
    errorField.textContent = "Student Name is empty!";
    return false;
  } else if (sId == "") {
    const errorField = document.getElementById("error");
    errorField.textContent = "Student ID is empty!";
    return false;
  } else if (containsA.test(sId) == false) {
    const errorField = document.getElementById("error");
    errorField.textContent = "Student ID must contain letter 'A'!";
    return false;
  } else if (containsEightNum.test(sId) == false) {
    const errorField = document.getElementById("error");
    errorField.textContent = "Student ID must contain eight numbers!";
    return false;
  }

  window.location.href = "/training_complete";
};