const express = require('express');
require('./helpers/dbConnection');
const bodyParser = require('body-parser');
const { errorHandler } = require('./middlewares');
const { Blog } = require('./models');
const { getBlogsHateos } = require('./helpers/constants');
const userRouter = require('./routes/usersRouter');
const articleRouter = require('./routes/articleRouter');
const commentRouter = require('./routes/commentRouter');

const server = express();

server.use(bodyParser.json());

const blogsRouter = express.Router();


// Blogs router
blogsRouter.post('/', async (req, res, next) => {
    const {title, body} = req.body;



    try {
        const { _id: blogId } = await Blog.create(
            { user: req.user._id, title, body }
        );

        req.user.blogs.push(blogId);
        await req.user.save();

    } catch (err) {
        return next(err);
    }
    res.status(204).end();
});

blogsRouter.get('/', async (req, res, next) => {
    console.log(req);
    const blogsHateos = getBlogsHateos('https://', 'localhost')

    res.status(200).send(blogsHateos);
});



userRouter.use('/:user_id/blogs', blogsRouter);
server.use('/users', userRouter);
server.use('/blogs', blogsRouter);
server.use('/articles', articleRouter);
server.use('/comments', commentRouter);


server.use(errorHandler);

server.listen(3000, 'localhost', () => {
    console.log(`server is listening on: 3000`);
});
