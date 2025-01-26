const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/check-auth', auth, authController.checkAuth);

module.exports = router;
