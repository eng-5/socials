const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Content = require('../models/Content');

exports.createPost = catchAsync(async (req, res, next) => {
    const authorId = req.headers['x-user-id'];
    const { text } = req.body;

    if (!text) return next(new AppError('Text is required to create a post', 400));

    const post = await Content.create({ authorId, text })
    return res.status(201).json({ status: 'success', post })
});


exports.getAllPosts = catchAsync(async (req, res, next) => {
    let { page, limit } = req.query;
    page = Number(page) || 1;
    limit = Number(limit) || 20;

    const [posts, totalCount] = await Promise.all([
        Content.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        Content.countDocuments({})
    ]);

    return res.status(200).json({
        status: 'success',
        posts,
        totalCount,
        currentPage: page,
        hasMore: page * limit < totalCount,
    })

})