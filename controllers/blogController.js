const { ObjectId } = require('mongodb');
const Blog = require('../models/blog');

// Function to create a new blog post
exports.createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user._id; // Assuming the user is logged in and their ID is stored in `req.user._id`
        const newBlog = new Blog({
            title,
            content,
            author: userId
        });

        const savedBlog = await newBlog.save();

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            blog: savedBlog
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the blog'
        });
    }
};


exports.getBlog = async (req, res) => {
    console.log(req.params);
    const id = req.params.id;
  
    // Check if the id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
  
    try {
      const blog = await Blog.findById(id);
      if (!blog) {
        res.status(404).json({ error: 'Blog not found' });
        return;
      }
      res.status(200).json(blog);
    } catch (err) {
        console.error(`Error retrieving blog: ${err}`);
        res.status(500).json({ error: `Error retrieving blog: ${err.message}` });
      }
      
  };
  exports.getBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find().populate('author', 'username');
      res.status(200).json({ success: true, blogs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while fetching blogs' });
    }
  };
  exports.updateBlog = async (req, res) => {
    const blogId = req.params.id;
    const { title, content } = req.body;
  
    // Check if the id is a valid ObjectId
    if (!ObjectId.isValid(blogId)) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
  
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { title, content },
        { new: true }
      );
  
      if (!updatedBlog) {
        res.status(404).json({ error: 'Blog not found' });
        return;
      }
  
      res.status(200).json({
        success: true,
        message: 'Blog updated successfully',
        blog: updatedBlog,
      });
    } catch (err) {
      console.error(`Error updating blog: ${err}`);
      res.status(500).json({ error: `Error updating blog: ${err.message}` });
    }
  };
  
  exports.deleteBlog = async (req, res) => {
    const blogId = req.params.id;
  
    // Check if the id is a valid ObjectId
    if (!ObjectId.isValid(blogId)) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
  
    try {
      const deletedBlog = await Blog.findByIdAndRemove(blogId);
  
      if (!deletedBlog) {
        res.status(404).json({ error: 'Blog not found' });
        return;
      }
  
      res.status(200).json({
        success: true,
        message: 'Blog deleted successfully',
        blog: deletedBlog,
      });
    } catch (err) {
      console.error(`Error deleting blog: ${err}`);
      res.status(500).json({ error: `Error deleting blog: ${err.message}` });
    }
  };
  