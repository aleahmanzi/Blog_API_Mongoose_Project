const mongoose = require('mongoose');

const blogSchema = mongoose.blogSchema({
	author: {
		firstName: String, 
		lastName: String
	},
	title: {type: String, required: true},
	content: {type: String, required: true},
	created: {type: Date, default: Date.now}
});

blogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
}


const blogPost = mongoose.model('blogPost', blogSchema);
