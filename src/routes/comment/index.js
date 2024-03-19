const express = require('express');
const router = express.Router();

const commentController = require('../../controllers/comment.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/checkAuth');

router.use(authentication);

router.post('', asyncHandler(commentController.createComment));
router.get('', asyncHandler(commentController.getCommentsByParentId));
router.delete('', asyncHandler(commentController.deleteCommentById));

module.exports = router;