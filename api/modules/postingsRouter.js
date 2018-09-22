let router = require('express').Router();
let Postings = require('./db').Postings
let Sequelize = require('sequelize');
module.exports = router;

router.get('/', function(req, res, next)  {
  Postings.findAll()
    .then(res.send.bind(res))
    .catch(next)
})

router.post('/', function(req,res,next) {
  Postings.create(req.body)
    .then(function(product) {
      res.send(product)
    })
    .catch(next);
})

router.get('/id/:id', function(req, res, next) {
  Postings.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(response=>res.send(response))
    .catch(next)
})

router.put('/id/:id', function(req, res, next) {
  Postings.findById(req.params.id)
    .then((result)=>{
      if (!result) res.sendStatus(404);
      result.update(req.body)
        .then(updateProd=>res.send(updateProd))
        .catch(next)
    })
})