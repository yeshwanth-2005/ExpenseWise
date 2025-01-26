// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('/api/check-auth');
        if (!response.ok) {
            window.location.href = '/';
        }
    } catch (error) {
        window.location.href = '/';
    }
}

// Load user data
async function loadUserData() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const user = await response.json();
            document.getElementById('userName').textContent = user.name;
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Update profile
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value
    };

    try {
        const response = await fetch('/api/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert('Profile updated successfully!');
            loadUserData(); // Reload user data
        } else {
            const data = await response.json();
            alert('Error: ' + (data.error || 'Failed to update profile'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Change password
document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }

    const passwordData = {
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: newPassword
    };

    try {
        const response = await fetch('/api/user/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passwordData)
        });

        if (response.ok) {
            alert('Password changed successfully!');
            e.target.reset();
        } else {
            const data = await response.json();
            alert('Error: ' + (data.error || 'Failed to change password'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Delete account
async function deleteAccount() {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    
    if (confirmed) {
        try {
            const response = await fetch('/api/user/delete', {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Account deleted successfully');
                window.location.href = '/';
            } else {
                const data = await response.json();
                alert('Error: ' + (data.error || 'Failed to delete account'));
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
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

// Initialize
checkAuth();
loadUserData();