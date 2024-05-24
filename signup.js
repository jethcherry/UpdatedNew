document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const passwordValidationMessage = document.getElementById('password-validation-message');

    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            passwordValidationMessage.textContent = passwordValidation.message;
            return;
        }

        // Prepare user data
        const userData = { username, email, password };

        try {
            // Send user data to the backend
            const response = await fetch('http://localhost:3000/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            // Check if the response is ok
            if (response.ok) {
                // Redirect to login page after successful registration
                window.location.href = 'login.html';
            } else {
                const errorData = await response.json();
                passwordValidationMessage.textContent = errorData.message || 'An error occurred during registration.';
            }
        } catch (error) {
            passwordValidationMessage.textContent = 'Failed to connect to the server. Please try again later.';
        }
    });

    function validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return { isValid: false, message: `Password must be at least ${minLength} characters long.` };
        }
        if (!hasUpperCase) {
            return { isValid: false, message: 'Password must contain at least one uppercase letter.' };
        }
        if (!hasLowerCase) {
            return { isValid: false, message: 'Password must contain at least one lowercase letter.' };
        }
        if (!hasDigit) {
            return { isValid: false, message: 'Password must contain at least one digit.' };
        }
        if (!hasSpecialChar) {
            return { isValid: false, message: 'Password must contain at least one special character.' };
        }

        return { isValid: true, message: '' };
    }
});
