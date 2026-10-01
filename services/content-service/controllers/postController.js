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

const parsePositiveInt = (value, fallback, name, max = Infinity) => {
    if (value === undefined) return fallback;
    const n = Number(value);
    if (!Number.isInteger(n) || n < 1 || n > max) {
        throw new AppError(`Invalid ${name}`, 400);
    }
    return n;
}
exports.getAllPosts = catchAsync(async (req, res, next) => {
    const page = parsePositiveInt(req.query.page, 1, 'page');
    const limit = parsePositiveInt(req.query.limit, 20, 'limit', 50);
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