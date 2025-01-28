// Handle the login form submission
document.getElementById("login-form").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get email and password values
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Call the API
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Email: email, Password: password }), // Updated to match server-side expectations
    });

    if (response.ok) {
      // Redirect or show a success message
      window.location.href = "/dashboard";
    } else {
      // Show error message for invalid credentials
      showErrorMessage("Invalid email or password.");
    }
  } catch (error) {
    // Show error message for server or network errors
    showErrorMessage("An error occurred. Please try again later.");
  }
});

// Function to show error message
function showErrorMessage(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.classList.remove("d-none");
}
