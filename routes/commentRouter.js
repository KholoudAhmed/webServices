const express = require('express');
const { errors } = require('../helpers/errors');
const { Comment, Article } = require('../models');

const commentRouter = express.Router();

commentRouter.post('/', async (req, res, next) => {
    try{
        const article = req.article;
        if(!article){
            throw new errors.APP_ERR_MISSING_ARTICLE_ID;
        }
        const articleObj = await article.exec();
        const articleId = articleObj._id;
        console.log();
        const {content, date, user} = req.body;
        const comment = await Comment.create({content, date, article: articleId, user});
        await Article.updateMany({_id: articleId}, {$push: {comments: comment._id}});
        res.status(200).send();
    }catch(error){
        next(error);
    }
})


commentRouter.patch('/:comment_id', async (req, res, next) => {
    try {
        const commentId = req.params.comment_id;
        const {content, date, user} = req.body;
        await Comment.updateOne({_id: commentId}, {content, date, user});
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

commentRouter.delete('/:comment_id', async (req, res, next) => {
    try {
        const commentId = req.params.comment_id;
        console.log(commentId);
        await Comment.deleteOne({_id: commentId});
        await Article.updateMany({}, {$pull: {comments: commentId}});
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});



commentRouter.param('/:comment_id', async (req, res, next) => {
    try {
        const commentId = req.params.comment_id;
        const comment = await Comment.findById(commentId);
        if(!commentId){
            throw new errors.APP_ERR_NO_SUCH_COMMENT;
        }
        req.comment = comment;
        next();
    } catch (error) {
        
    }
})


module.exports = commentRouter;