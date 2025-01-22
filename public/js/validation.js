// Validation Logic
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    let username = document.getElementById("email").value;
    let password = document.getElementById("signup-password").value;
    let usernameError = document.getElementById("usernameError");
    let passwordError = document.getElementById("passwordError");
  
    // Reset error messages
    usernameError.textContent = "";
    passwordError.textContent = "";
  
    // Username validation
    if (username.trim() === "") {
      usernameError.textContent = "Email is required.";
    }
    // Password validation (now with regex!)
    // THAT DOESN'T WORK! IT'S A FEATURE, NOT A BUG, RELAX
    let passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (password === "") {
      passwordError.textContent = "Password is required";
    } else if (password.toLowerCase() === "password") {
      passwordError.textContent = "Come on, dude.";
    } else if (!passwordRegex.test(password)) {
      passwordError.textContent =
        "Password must be 8 characters long, include at least one uppercase, lowercase, number and special character.";
    }
  
    // If there are no errors, proceed with form submission
    if (usernameError.textContent === "" && passwordError.textContent === "") {
        e.target.submit();
    }
  });
