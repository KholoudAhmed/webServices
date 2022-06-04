const express = require('express');
const { CustomError, errors } = require('../helpers/errors');
const { User, Article } = require('../models');
const commentRouter = require('./commentRouter');

const articleRouter = express.Router();

articleRouter.get('/', async (req, res, next) => {
    try{
        if(req.user){
            const populatedUser = await req.user.populate('articles');
            const userArticles = populatedUser.articles;
            res.status(200).send(userArticles);
        }else{
            const articles = await Article.findMany({});
            res.status(200).send({articles});
        }
    }catch(error){
        next(error);
    }
});

articleRouter.get('/:article_id', async (req, res, next) => {
    try{
        const populatedArticle = await req.article.populate('comments');
        res.status(200).send(populatedArticle);
    }catch(error){
        next(error)
    }
})

articleRouter.param('article_id', async (req, res, next) => {
    try{
        const article_id = req.params.article_id;
        const article = await Article.findById(article_id);
        if(!article){
            //no such article
            throw new errors.APP_ERR_NO_SUCH_ARTICLE;
        }
        req.article = article;
        next();
    }catch(error){
        next(error)
    }
});

articleRouter.get('/:article_id/comments', async (req, res, next) => {
    try{
        const article = req.article;
        const populateedArticle = await article.populate('comments');
        res.status(200).send(populateedArticle.comments);
    }catch(error){
        next(error);
    }
});

articleRouter.get('/:article_id/author', async (req, res, next) => {
    try{
        const article = req.article;
        const populateedArticle = await article.populate('author');
        res.status(200).send(populateedArticle.author);
    }catch(error){
        next(error);
    }
});


articleRouter.post('/', async (req, res, next) => {
    try{
        const author = req.user;
        if(!author){
            throw new errors.APP_ERR_NO_SUCH_USER;
        }
        const userId = author._id;
        const {title, body, date} = req.body;
        const article = await Article.create({title, body, date, author: userId, comments: []});
        await User.updateMany({_id: userId}, {$push: {articles: article._id}})
        res.status(200).send({success: true, message: 'Created Succesfully'});
    }catch(error){
        next(error);
    }
});


articleRouter.patch('/:article_id', async (req, res, next) => {
    try{
        const {title, body, date} = req.body;
        await Article.updateOne({_id: req.params.article_id}, {title, body, date});
        res.status(200).send();
    }catch(error){
        next(error);
    }
})

articleRouter.delete('/:article_id', async (req, res, next) => {
    try{
        const articleId = req.params.article_id;
        await Article.deleteOne({_id: articleId});
        await User.updateMany({}, {$pull: {articles: articleId}});
        res.status(200).send();
    }catch(error){
        next(error);
    }
});


articleRouter.use('/:article_id/comments', commentRouter);


module.exports = articleRouter;

