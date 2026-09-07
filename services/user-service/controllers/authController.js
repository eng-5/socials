// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

const signToken = (userId) => {
    return jwt.sign({ id: userId, jti: uuidv4() }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
// Login controller
exports.login = async (req, res) => {
    try {
        // check if the username and password exist in the body of the request(req.body)
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }
        // check if the user exist with the email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Check if the password is correct using the compare function we defined in the User model
        const isUser = await user.comparePassword(password);
        if (!isUser) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = signToken(user.id);
        return res.status(200).json({
            token,
            user: { userId: user.id, username: user.username, email: user.email }
        })
    } catch (err) {
        console.error(err);
        res.status(500).json('Something went wrong');
    }
}