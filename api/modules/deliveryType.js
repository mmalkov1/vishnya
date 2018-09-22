let router = require('express').Router();
let DeliveryType = require('./db').DeliveryType;
module.exports = router;

router.get('/', function(req, res, next) {
  DeliveryType.findAll()
    .then(res.send.bind(res))
    .catch(next)
})