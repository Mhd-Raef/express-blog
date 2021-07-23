const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  snippet: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});

//                          VV this model name "Blog"
// will pluralized to 'Blogs' which is the collection in DB
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;