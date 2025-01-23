// Validation Logic
// Worst Code Ever Written?????
// Handle the sign-up form submission
document.getElementById("signupModal").addEventListener("submit", function (e) {
    e.preventDefault();

    let username = document.getElementById("signup-name").value;
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;
    let usernameError = document.getElementById("usernameError");
    let passwordError = document.getElementById("passwordError");

    // Reset error messages
    usernameError.textContent = "";
    passwordError.textContent = "";

    // Username validation
    if (username.trim() === "") {
        usernameError.textContent = "Name is required.";
    }

    // Password validation
    if (password === "") {
        passwordError.textContent = "Password is required.";
    } else if (!passwordRegex.test(password)) {
        passwordError.textContent =
            "Password must be 8 characters long, include at least one uppercase, lowercase, number, and special character.";
    }

    // If there are no errors, proceed with form submission
    if (usernameError.textContent === "" && passwordError.textContent === "") {
        e.target.submit();
    }
});
