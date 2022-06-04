const express = require('express');

const userRouter = express.Router();
const articleRouter = require('./articleRouter');
const {User} = require('../models');
const hateos = require('../helpers/constants');
const { errors } = require('../helpers/errors');


userRouter.get('/', async(req, res, next) => {
    try{
        const users = await User.find({}).exec();
        const ret = {...hateos.getUsersHateos(req.protocol + '://', req.get('host')), users};
        res.status(200).send(ret);
    }catch(error){
        next(error)
    }
})

// User Router
userRouter.get('/:user_id', async (req, res) => {
    res.header({
        'Content-Type': 'application/json'
    });
    const populatedUser = await req.user.populate('articles');
    res.status(201)
        .send(populatedUser);
});



userRouter.post('/', async (req, res, next) => {
    try {
        const {firstname, lastname, dob, email} = req.body;
        await User.create({ firstname, lastname, dob, email });
        res.status(204);
        res.send();
    } catch (err) {
        next(err);
    }
});



userRouter.param('user_id', async (req, res, next, userId) => {
    console.log('userID: ', userId);
    try {
        const user = await User.findById(userId);
        if (!user) throw new errors.APP_ERR_NO_SUCH_USER;
        req.user = user;
    } catch (err) {
        return next(err);
    }
    next();
});


userRouter.post('/:user_id/suspend', async (req, res, next) => {
    try {
        const userId = req.params.user_id;
        await User.updateOne({_id: userId}, {isSuspended: true});
        res.status(200).send();
    } catch (error) {
        next(error);
    }
})


userRouter.post('/:user_id/unsuspend', async (req, res, next) => {
    try {
        const userId = req.params.user_id;
        await User.updateOne({_id: userId}, {isSuspended: false});
        res.status(200).send();
    } catch (error) {
        next(error);
    }
})



userRouter.use('/:user_id/articles', articleRouter);

module.exports = userRouter;