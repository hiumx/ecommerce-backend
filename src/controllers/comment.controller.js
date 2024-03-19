'use strict';

const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
    async createComment(req, res, next) {
        new SuccessResponse({
            message: 'Create new comment success',
            metadata: await CommentService.createComment(req.body)
        }).send(res);
    }

    async getCommentsByParentId(req, res, next) {
        new SuccessResponse({
            message: 'Get comments by parent id success',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res);
    }

    async deleteCommentById(req, res, next) {
        new SuccessResponse({
            message: 'Delete comment success',
            metadata: await CommentService.deleteComment(req.body)
        }).send(res);
    }
}

module.exports = new CommentController();