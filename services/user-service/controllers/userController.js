exports.getMe = async (req, res) => {
    res.status(200).json({ userId: req.headers['x-user-id'], success: 'was successfull' });
}