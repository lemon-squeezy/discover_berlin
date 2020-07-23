function sendMail(contactForm) {
    emailjs.send("gmail", "standard_template", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "request": contactForm.request.value
        
    })
    .then(
        function(response) {
            console.log("SUCCESS", response);
        },
        function(error) {
            console.log("FAILED", error);
        },
        function ClearFields() {

            document.getElementById("fullname").value = "";
            document.getElementById("emailaddress").value = "";
            document.getElementById("Request").value = "";
        }
    );
    return false;  // To block from loading a new page
}

