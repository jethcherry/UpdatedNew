document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3000/user')
        .then(response => response.json())
        .then(users => {
            const user = users.find(user => user.username === username);

            if (!user) {
                alert('Invalid username');
                return;
            }

            if (user.password !== password) {
                alert('Invalid password');
                return;
            }

            window.location.href = `index.html?username=${encodeURIComponent(username)}`; 
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

window.addEventListener('load', function() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    if (username) {
        document.getElementById('login-username').value = username;
    }
});
