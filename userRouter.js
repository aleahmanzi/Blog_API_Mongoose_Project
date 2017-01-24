let router = require('express').Router();


router.get('/', function (req, res) {
  res.status(200).send("no users yet");
});

router.get('/:id', function (req, res) {
  res.status(200).send("searched for id " + req.params.id);
});

module.exports = router;