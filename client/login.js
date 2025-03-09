document.getElementById("studentSubmit").onclick = function validateForm() {
    const containsA = /A/g;
    const containsEightNum = /\d{8}/g;


    let sName = document.forms["studentForm"]["studentName"].value;
    let sId = document.forms["studentForm"]["studentId"].value;
    if (sName == "") {
        var errorField = document.getElementById("error");
        errorField.textContent = "Student Name is empty!";
        return false;
    } else if (sId == "") {
        var errorField = document.getElementById("error");
        errorField.textContent = "Student ID is empty!";
        return false;
    } else if (containsA.test(sId) == false) {
        var errorField = document.getElementById("error");
        errorField.textContent = "Student ID must contain letter 'A'!";
        return false;
    } else if (containsEightNum.test(sId) == false) {
        var errorField = document.getElementById("error");
        errorField.textContent = "Student ID must contain eight numbers!";
        return false;
    }

    window.location.href = "../training_complete/index.html";
};