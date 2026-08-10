// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic presence check for now - we'll upgradethis to Zod validation shortly
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'username, email and password are required' });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const user = await User.create({ username, email, password });
        const token = signToken(user.id);

        res.status(201).json({
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }

}