// Email.js script

function sendMail(contactForm) {
    emailjs.send("gmail", "standard_template", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "request": contactForm.request.value

    })
        .then(
            function (response) {
                console.log("SUCCESS", response);
            },
            function (error) {
                console.log("FAILED", error);
            }
        );
    return false;  // To block from loading a new page
}

function submitForm(button) {
    sendMail(button.parentElement);
    button.parentElement.reset();
}