let Sequelize = require('sequelize');
let router = require('express').Router();
let ProductPrice = require('./db').ProductPrice;
module.exports = router;

router.get('/', function(req, res, next)  {
  ProductPrice.findAll({
    include: {all:true}
  })
    .then(res.send.bind(res))
    .catch(next)
})

router.put('/', function(req,res,next){
  const Op = Sequelize.Op;
  ProductPrice.destroy({
    where: {
      accProductId: req.body.id
    }
  })
  for (let item of req.body.price) {
    ProductPrice.create(item)
      .then(()=>console.log(`Price for product ${item.accProductId} is updated!!!`))      
      .catch(next)
  }
  res.send(true);
})

router.post('/', function(req,res,next){
  ProductPrice.bulkCreate(req.body.info)
    .then((response)=>{
      res.send(response);
    })
})

