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

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date for display
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format date for input
function formatDateForInput(dateString) {
    return new Date(dateString).toISOString().split('T')[0];
}

// Edit modal instance
const editModal = new bootstrap.Modal(document.getElementById('editModal'));

// Show edit modal
function showEditModal(type, id) {
    const transaction = allTransactions.find(t => t._id === id);
    if (!transaction) return;

    document.getElementById('editId').value = id;
    document.getElementById('editType').value = type;
    document.getElementById('editTitle').value = transaction.title;
    document.getElementById('editAmount').value = transaction.amount;
    document.getElementById('editDate').value = formatDateForInput(transaction.date);
    document.getElementById('editNotes').value = transaction.notes || '';

    // Update categories based on type
    const categorySelect = document.getElementById('editCategory');
    categorySelect.innerHTML = '';
    const categories = type === 'income' 
        ? ['salary', 'freelance', 'investments', 'rental', 'other']
        : ['food', 'transportation', 'utilities', 'shopping', 'entertainment', 'savings'];
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
    });
    
    categorySelect.value = transaction.category;
    editModal.show();
}

// Delete transaction
async function deleteTransaction() {
    const id = document.getElementById('editId').value;
    const type = document.getElementById('editType').value;

    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
        const response = await fetch(`/api/${type}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            editModal.hide();
            updateDashboardSummary();
        } else {
            const data = await response.json();
            alert('Error: ' + (data.error || 'Failed to delete transaction'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Handle edit form submission
document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const type = document.getElementById('editType').value;
    const transactionData = {
        title: document.getElementById('editTitle').value,
        amount: parseFloat(document.getElementById('editAmount').value),
        category: document.getElementById('editCategory').value,
        date: document.getElementById('editDate').value,
        notes: document.getElementById('editNotes').value
    };

    try {
        const response = await fetch(`/api/${type}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        });

        if (response.ok) {
            editModal.hide();
            updateDashboardSummary();
        } else {
            const data = await response.json();
            alert('Error: ' + (data.error || 'Failed to update transaction'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

let allTransactions = [];

// Update dashboard summary
async function updateDashboardSummary() {
    try {
        const [incomeResponse, expenseResponse] = await Promise.all([
            fetch('/api/income'),
            fetch('/api/expense')
        ]);

        const incomes = await incomeResponse.json();
        const expenses = await expenseResponse.json();

        // Calculate totals
        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
        const totalExpenses = expenses.reduce((sum, expense) => 
            expense.category === "savings" ? sum : sum + expense.amount, 0);
        const totalSavings = expenses.reduce((sum, expense) => 
            expense.category === "savings" ? sum + expense.amount : sum, 0);
        const balance = totalIncome - totalExpenses - totalSavings;

        // Update summary cards
        document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
        document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
        document.getElementById('totalBalance').textContent = formatCurrency(balance);
        document.getElementById('totalSavings').textContent = formatCurrency(totalSavings);

        // Combine and sort transactions
        allTransactions = [
            ...incomes.map(income => ({ ...income, type: 'income' })),
            ...expenses.map(expense => ({ ...expense, type: 'expense' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Update transactions table
        const transactionsTable = document.getElementById('transactionsTable');
        transactionsTable.innerHTML = allTransactions.map(transaction => `
            <tr>
                <td>${formatDate(transaction.date)}</td>
                <td>${transaction.title}</td>
                <td>${transaction.category}${transaction.isSavings ? ' (Savings)' : ''}</td>
                <td class="text-${transaction.type === 'income' ? 'success' : transaction.isSavings ? 'warning' : 'danger'}">
                    ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
                </td>
                <td>
                    <span class="badge bg-${transaction.type === 'income' ? 'success' : transaction.isSavings ? 'warning' : 'danger'}">
                        ${transaction.isSavings ? 'Savings' : transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="showEditModal('${transaction.type}', '${transaction._id}')">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}
async function loadUserName() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const user = await response.json();
            document.getElementById('userName').textContent = user.name;
        }
    } catch (error) {
        console.error('Error loading user name:', error);
    }
}

// Delete account function
async function deleteAccount() {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    
    if (confirmed) {
        try {
            const response = await fetch('/api/user', {
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



// Initialize
checkAuth();
updateDashboardSummary();

// Update dashboard every 30 seconds
setInterval(updateDashboardSummary, 30000);
loadUserName();