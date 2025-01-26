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

// Set default date to today
document.getElementById('expenseDate').valueAsDate = new Date();

// Handle category change
document.getElementById('expenseCategory').addEventListener('change', function(e) {
    const isSavingsCheckbox = document.getElementById('isSavings');
    if (e.target.value === 'savings') {
        isSavingsCheckbox.checked = true;
    }
});

// Handle form submission
document.getElementById('expenseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const expenseData = {
        title: document.getElementById('expenseTitle').value,
        amount: parseFloat(document.getElementById('expenseAmount').value),
        category: document.getElementById('expenseCategory').value,
        date: document.getElementById('expenseDate').value,
        notes: document.getElementById('expenseNotes').value,
        isSavings: document.getElementById('isSavings').checked
    };

    try {
        const response = await fetch('/api/expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        });

        if (response.ok) {
            alert('Expense added successfully!');
            e.target.reset();
            document.getElementById('expenseDate').valueAsDate = new Date();
        } else {
            const data = await response.json();
            alert('Error: ' + (data.error || 'Failed to add expense'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Initialize
checkAuth();