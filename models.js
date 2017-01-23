const mongoose = require('mongoose');

const blogSchema = mongoose.blogSchema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {type: String, required: true},
	publishDate: {type: String, required: true}

});

const blogPost = mongoose.model('blogPost', blogSchema);
