let router = require("express").Router();
let OrderProducts = require("./db").OrderProducts;
let Sequelize = require("sequelize");
module.exports = router;

router.post("/", function(req, res, next) {
  OrderProducts.bulkCreate(req.body.info)
    .then(response => {
      res.send(response);
    })
    .catch(next);
});

router.get("/id/:type/:id", function(req, res, next) {
  const Op = Sequelize.Op;
  OrderProducts.findAll({
    where: {
      [Op.and]: [
        {
          document_type: req.params.type
        },
        {
          order_id: req.params.id
        }
      ]
    }
  })
    .then(response => {
      res.send(response);
    })
    .catch(next);
});

router.get("/:id", function(req, res, next) {
  const Op = Sequelize.Op;
  OrderProducts.findAll({
    where: {
      product_id: req.params.id
    }
  })
    .then(response => {
      res.send(response);
    })
    .catch(next);
});

router.put("/productid", function(req, res, next) {
  OrderProducts.findAll({
    where: {
      product_id: req.body
    }
  })
    .then(response => res.send(response))
    .catch(next);
});

router.get("/", function(req, res, next) {
  OrderProducts.findAll({
    include: [{ all: true }]
  })
    .then(res.send.bind(res))
    .catch(next);
});

router.put("/id/:type/:id", function(req, res, next) {
  const Op = Sequelize.Op;
  OrderProducts.destroy({
    where: {
      [Op.and]: [
        {
          document_type: req.params.type
        },
        {
          order_id: req.params.id
        }
      ]
    }
  }).then(() => {
    for (let item of req.body) {
      console.log(req.body);
      OrderProducts.create(item)
        .then(() =>
          console.log(
            `Product ${item.product_id} of Order ${item.order_id} is updated!!!`
          )
        )
        .catch(err => console.log(err));
    }
    res.send(true);
  });
});
