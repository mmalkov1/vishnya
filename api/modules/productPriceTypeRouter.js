let router = require('express').Router();
let Products = require('./db').PriceType
module.exports = router;

router.get('/', function(req, res, next)  {
  Products.findAll()
    .then(res.send.bind(res))
    .catch(next)
})