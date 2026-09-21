// routes/authRouter.js
const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const { getMe } = require('../controllers/userController');

router.post('/register', register);
// Login route
router.post('/login', login)
router.post('/logout', logout)

module.exports = router;
