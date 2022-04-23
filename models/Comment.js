const { Schema, model } = require('mongoose');

/*------------------------------------------------
-  create Comment model using the Pizza Schema
------------------------------------------------*/

const CommentSchema = new Schema({
  writtenBy: {
    type: String
  },
  commentBody: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Comment = model('Comment', CommentSchema);

/*------------------------------------------------
-   export the Comment model
------------------------------------------------*/

module.exports = Comment;