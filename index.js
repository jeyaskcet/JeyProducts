document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();
        var username = document.getElementById("username").value;
        
        var password = document.getElementById("password").value;
        
        if (username.trim() === "" || password.trim() === "") {
            alert("Please enter both username and password.");
            return;
        }

        // Check username and password (this is a basic example)
        var validCredentials = [
            { username: "Jey", password: "jey" },
            { username: "Krishna", password: "krishna" },
             { username: "Apoorva", password: "apoorva" }
        ];

        var validUser = false;
        var validPassword = false;

        for (var i = 0; i < validCredentials.length; i++) {
            if (username === validCredentials[i].username) {
                validUser = true;
                if (password === validCredentials[i].password) {
                    validPassword = true;
                    break;
                }
            }
        }

        if (validUser) {
            if (validPassword) {
                localStorage.setItem("username", username);
                window.location.href = "home.html";
            } else {
                alert("Incorrect password. Please try again.");
            }
        } else {
            alert("Username not found. Please try again.");
        }
    });
});
