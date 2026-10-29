const User = require('../models/User');
exports.getMe = async (req, res) => {
    // res.status(200).json({ userId: req.headers['x-user-id'], success: 'was successfull' });
    try {
        const user = await User.findByPk(req.headers['x-user-id']);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({
            user: { id: user.id, username: user.username, email: user.email }
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}