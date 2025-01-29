const validateSignUp = (Email, password) => {
  const EmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  if (!EmailRegex.test(Email)) {
    return { valid: false, message: 'Invalid Email address' };
  }

  if (!passwordRegex.test(password)) {
    return { valid: false, message: 'Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one number and one special character' };
  }

  return { valid: true, message: 'Sign up successful' };
};

document.getElementById("signupModal").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get Email and password values from the sign-up form
  const Email = document.getElementById("signup-Email").value;
  const password = document.getElementById("signup-password").value;

  // Call the validation function for sign-up
  const validationResult = validateSignUp(Email, password);

  // Display error messages if validation fails
  if (!validationResult.valid) {
    document.getElementById("passwordError").innerText = validationResult.message;
  } else {
    // Clear any previous error messages
    document.getElementById("passwordError").innerText = ""; 
    this.submit(); // Submit the form if validation passes
  }
});