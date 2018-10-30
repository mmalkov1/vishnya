let router = require('express').Router();
let Users = require('./db').Users
let Sequelize = require('sequelize');

const Op = Sequelize.Op;


router.get('/', function(req, res, next)  {
  Users.findAll()
    .then(res.send.bind(res))
    .catch(next)
})

module.exports = router;