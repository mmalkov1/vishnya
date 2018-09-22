let router = require('express').Router();
let Category = require('./db').Category
module.exports = router;

router.get('/', function(req, res, next)  {
  Category.findAll()
    .then(res.send.bind(res))
    .catch(next)
})