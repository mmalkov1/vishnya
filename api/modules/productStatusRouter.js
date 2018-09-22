let router = require('express').Router();
let ProductStatus = require('./db').ProductStatus
module.exports = router;

router.get('/', function(req, res, next)  {
  ProductStatus.findAll()
    .then(res.send.bind(res))
    .catch(next)
})