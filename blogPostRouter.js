const router = require('express').Router();
const morgan = require('morgan');

const {blogPost} = require('./models');

router.use(function(req, res) {
  console.log("---- in the blog post router ----");
});
// GET REQUEST
router.get('/', (req, res) => {
  blogPost
    .find()
    .limit(10)
    .exec()
    .then(blogPost => {
      res.json({
        blogPost: blogPost.map(
          (blogPost) => blogPost.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

// POST REQUEST
router.post('/', (req, res) => {

  const requiredFields = ['title', 'content'];
  requiredFields.forEach(field => {
    if (! (field in req.body && req.body[field])) {
      return res.status(400).json({message: `Must specify value for ${field}`});
    }
  });

  blogPost
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      created: req.body.created})
    .then(
      blogPost => res.status(201).json(blogPost.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});


// PUT REQUEST
router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ['title', 'content', 'author'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  blogPost
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .exec()
    .then(blogPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});



// DELET REQUEST
router.delete('/:id', (req, res) => {
  blogPost
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(blogPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

module.exports = router;