const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const expenseController = require('../controllers/expenseController');

router.post('/', auth, expenseController.newExpense);
router.get('/', auth, expenseController.getExpenses);
router.put('/:id', auth, expenseController.updateExpense);
router.delete('/:id', auth, expenseController.deleteExpense);

module.exports = router;