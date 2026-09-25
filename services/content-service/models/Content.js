// models/Content.js
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    authorId: {
        type: String,
        required: [true, 'Author Id is required']
    },
    text: {
        type: String,
        maxLength: [200, 'Content too long'],
        trim: true,
        required: [true, 'Content is required']
    },
    likes: {
        type: [String]
    },
    hashtags: {
        type: [String]
    }
},
    {
        timestamps: true
    }
)
contentSchema.index({ authorId: 1 });
contentSchema.index({ createdAt: -1 });


module.exports = mongoose.model('Content', contentSchema);