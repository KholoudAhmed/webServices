const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const UserSchema = new Schema({
   _id: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },
   firstname: String,
   lastname: String,
   dob: {
      type: mongoose.Schema.Types.Date,
   },
   isSuspended: {
      type: mongoose.Schema.Types.Boolean,
      default: false
   },

   email: {
      type: String,
      required: true
   },
   articles: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article"
   }]
});

const BlogSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   body: String,
   user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
   },
   comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
   }]
})


//title, body, comments, date

const articleSchema = new Schema({
   _id: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },

    title: String,

    body: String,

    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
   }],
   author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
   },
   date: {
      type: mongoose.Schema.Types.Date,
      default: Date.now()
   }

})


const CommentSchema = new Schema({
   _id: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },

   content: String,
   date: {
      type: mongoose.Schema.Types.Date,
      default: Date.now()
   },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog"
   },
})


const User = mongoose.model("User", UserSchema);
const Blog = mongoose.model("Blog", BlogSchema);
const Comment = mongoose.model("Comment", CommentSchema);
const Article = mongoose.model("Article", articleSchema);

module.exports = {User, Blog, Comment, Article}