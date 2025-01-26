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

// Handle form submission
document.getElementById('incomeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const incomeData = {
        title: document.getElementById('incomeTitle').value,
        amount: parseFloat(document.getElementById('incomeAmount').value),
        category: document.getElementById('incomeCategory').value,
        date: document.getElementById('incomeDate').value,
        notes: document.getElementById('incomeNotes').value
    };

    try {
        const response = await fetch('/api/income', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(incomeData)
        });

        if (response.ok) {
            alert('Income added successfully!');
            e.target.reset();
        } else {
            const data = await response.json();
            alert('Error: ' + (data.error || 'Failed to add income'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Initialize
checkAuth();