'use strict';

const { NotFoundError } = require("../core/error.response");
const { findProductById } = require("../models/repositories/product.repo");
const CommentModel = require('../models/comment.model');
const { convertToObjectIdMongoDb } = require("../utils");

class CommentService {
    static async createComment({ productId, userId, content, parentCommentId = null }) {

        const productFound = await findProductById(productId);
        if (!productFound) throw new NotFoundError('Product not found!');

        const comment = new CommentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        });

        let leftValue;
        if (parentCommentId) {
            const foundParentComment = await CommentModel.findById(parentCommentId);

            if (!foundParentComment) throw new NotFoundError('Parent comment not found!');

            const rightValue = foundParentComment.comment_right;
            leftValue = rightValue;

            await CommentModel.updateMany({
                comment_productId: convertToObjectIdMongoDb(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            });

            await CommentModel.updateMany({
                comment_productId: convertToObjectIdMongoDb(productId),
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            });

        } else {
            const maxRightValue = await CommentModel.findOne({
                comment_productId: convertToObjectIdMongoDb(productId)
            }, 'comment_right', { sort: { comment_right: -1 } });
            if (maxRightValue)
                leftValue = maxRightValue.comment_right + 1;
            else
                leftValue = 1;
        }

        comment.comment_left = leftValue;
        comment.comment_right = leftValue + 1;

        await comment.save();

        return comment;
    }

    static async getCommentsByParentId({ productId, parentCommentId, limit = 50, offset = 0 }) {

        const foundProduct = await findProductById(productId);
        if (!foundProduct) throw new NotFoundError('Product not found!');

        if (parentCommentId) {
            const foundParentComment = await CommentModel.findById(parentCommentId);
            if (!foundParentComment) throw new NotFoundError('Not found parent comment!');

            const comments = await CommentModel.find({
                comment_productId: convertToObjectIdMongoDb(productId),
                comment_left: { $gt: foundParentComment.comment_left },
                comment_right: { $lt: foundParentComment.comment_right }
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({ comment_left: 1 });
            return comments;
        }

        const comments = await CommentModel.find({
            comment_productId: convertToObjectIdMongoDb(productId),
            comment_parentId: parentCommentId
        });

        return comments;
    }

    static async deleteComment({ productId, commentId }) {
        const foundProduct = await findProductById(productId);
        if (!foundProduct) throw new NotFoundError('Product not found!');

        const foundComment = await CommentModel.findById(commentId);
        if (!foundComment) throw new NotFoundError('Comment not found!');

        const leftValue = foundComment.comment_left;
        const rightValue = foundComment.comment_right;

        const width = rightValue - leftValue + 1;

        await CommentModel.deleteMany({
            comment_productId: convertToObjectIdMongoDb(productId),
            comment_left: { $gte: leftValue, $lte: rightValue }
        });

        await CommentModel.updateMany({
            comment_productId: convertToObjectIdMongoDb(productId),
            comment_left: { $gt: rightValue }
        }, { $inc: { comment_left: -width } });

        await CommentModel.updateMany({
            comment_productId: convertToObjectIdMongoDb(productId),
            comment_right: { $gt: rightValue }
        }, { $inc: { comment_right: -width } });

        return foundComment;
    }
}

module.exports = CommentService;