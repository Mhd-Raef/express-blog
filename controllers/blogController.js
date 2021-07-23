const Blog = require('../models/blog');

const blog_index = (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then((result) => {
      res.render('blogs/index', { title: 'All blogs', blogs: result })
    })
    .catch((err) => {
      console.log(err);
    })
}

const blog_create_get = (req, res) => {
  res.render('blogs/create', { title: 'Create a new blog', csrfToken: req.csrfToken() });
}

const blog_create_post = (req, res) => {
  
  const blog = new Blog(req.body);
  blog.save()
    .then((result) => {
      // blog_assign_author(blog, user_id);
      res.redirect('/blogs');
    })
    .catch((err) => {
      console.log(err);
    })

}

const blog_details = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Blog.findById(id).populate('author');
    res.render('blogs/details', { blog: result, title: 'Blog details', csrfToken: req.csrfToken() })
    
  } catch (error) {
    res.status(404).render('404', { title: 'blog not found' })
    
  }
    
}

const blog_delete = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: '/blogs' })
    }).catch((err) => {
      console.log(err);
    });
}

const blog_assign_author = async (blog, user_id) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blog._id,
      {
        author: user_id
      },
      {
        new: true,
        useFindAndModify: false
      }
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  blog_index,
  blog_create_get,
  blog_create_post,
  blog_details,
  blog_delete
}