const express = require('express');
const router = express.Router();
const { createPost, getAllPosts } = require('../controllers/postController');

router.get('/', getAllPosts);

router.post('/', createPost);

module.exports = router;
