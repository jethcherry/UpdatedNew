document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage) {
        document.getElementById('password-validation-message').innerText = passwordValidationMessage;
        return;
    } else {
        document.getElementById('password-validation-message').innerText = '';
    }

    saveUserData(username, email, password)
        .then(() => {
            window.location.href = `login.html?username=${encodeURIComponent(username)}`;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('password-validation-message').innerText = 'Failed to sign up. Please try again.';
        });
});

function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasUpperCase) {
        return 'Password must contain at least one uppercase letter.';
    }
    if (!hasLowerCase) {
        return 'Password must contain at least one lowercase letter.';
    }
    if (!hasNumber) {
        return 'Password must contain at least one number.';
    }
    if (!hasSpecialChar) {
        return 'Password must contain at least one special character.';
    }
    return '';
}

function saveUserData(username, email, password) {
    return fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.message || 'Failed to sign up');
            });
        }
        return response.json();
    });
}

