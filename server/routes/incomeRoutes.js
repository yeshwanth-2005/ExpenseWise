const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const incomeController = require('../controllers/incomeController');

router.post('/', auth, incomeController.newIncome);
router.get('/', auth, incomeController.getIncomes);
router.put('/:id', auth, incomeController.updateIncome);
router.delete('/:id', auth, incomeController.deleteIncome);

module.exports = router;