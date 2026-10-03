const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, updatePost, deletePost } = require('../controllers/postController');

router.get('/', getAllPosts);

router.post('/', createPost);
router.patch('/:id', updatePost);

router.delete('/:id', deletePost);

module.exports = router;
