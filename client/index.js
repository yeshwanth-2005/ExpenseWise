// Modal instances
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));

// Show modal functions
function showLoginModal() {
    loginModal.show();
}

function showSignupModal() {
    signupModal.show();
}

// Form submissions
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(data)
        if (data.success) {
            window.location.href = '/pages/dashboard/dashboard.html';
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (data.success) {
            window.location.href = '/pages/dashboard/dashboard.html';
        } else {
            alert('Signup failed: ' + data.error);
        }
    } catch (error) {
        alert('Signup failed: ' + error.message);
    }
});