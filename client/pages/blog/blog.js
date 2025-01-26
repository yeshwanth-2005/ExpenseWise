// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('/api/check-auth');
        if (!response.ok) {
            window.location.href = '/pages/landing/landing.html';
        }
    } catch (error) {
        window.location.href = '/pages/landing/landing.html';
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

function toggleText(button) {
    const targetId = button.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    targetElement.addEventListener('hidden.bs.collapse', () => {
        button.textContent = 'Read More';
    });
    targetElement.addEventListener('shown.bs.collapse', () => {
        button.textContent = 'Read Less';
    });
}


// Initialize
checkAuth();