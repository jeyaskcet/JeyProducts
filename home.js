document.addEventListener("DOMContentLoaded", function () {
    // Get the welcome message element
    const welcomeMessage = document.getElementById("welcomeMessage");
    
    // Get the start button and loading element
    const startButton = document.getElementById("startButton");
    const loadingElement = document.getElementById("loadingElement");
    
    // Retrieve the username from local storage
var username = localStorage.getItem("username");

// Update the profile box with the username
var profileNameElement = document.querySelector(".profile-name");
if (profileNameElement) {
  profileNameElement.textContent = username;
}

    // Display the welcome message
    welcomeMessage.innerHTML = `<h2>Welcome, <span class="highlight_welcomeMsg">${username}</span>!</h2>`;
    
    // Add a click event listener to the start button
    startButton.addEventListener("click", function () {
        // Hide the start button
        startButton.style.display = "none";
        
        // Show the loading element
        loadingElement.style.display = "block";
        
        // Simulate a delay (for demonstration purposes)
        setTimeout(function () {
            // Redirect to another page
            window.location.href = "billingpage.html";
        }, 2000); // 2 seconds delay
    });
});
