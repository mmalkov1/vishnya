let router = require('express').Router();
let Products = require('./db').Products
let Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = router;

router.get('/', function(req, res, next)  {
  Products.findAll({
    include: [{all:true}],
    })
    .then(res.send.bind(res))
    .catch(next)
})

router.get('/id/:id', function(req, res, next){
  Products.findOne({
    where: {
      id: req.params.id
    },
    include: {all:true}
  })
  .then(function(product){
    if (!product) res.send('Product not found')
    else res.send(product)
  })
})

router.get('/find', function(req, res, next){
  Products.findAll({
    where: {
      [Op.or] : {
        product_name: {
          [Op.like]: `%${req.query.search}%`
        },
        product_art : {
          [Op.like]: `%${req.query.search}%`
        }
      }
    },
    include: {all:true}
  })
  .then(function(product){
    if (!product) res.send('Product not found')
    else res.send(product)
  })
})

router.post('/', function(req,res,next) {
  Products.create(req.body)
    .then(function(product) {
      res.send(product)
    })
    .catch(next);
})


router.put('/:id', function (req, res, next) {
  Products.findById(req.params.id, {all:true})
    .then((result)=>{
      if(!result) res.sendStatus(404);
      result.update(req.body)
        .then((updateProd)=>{
          res.send(updateProd)
        })
    })
    .catch(next)
})