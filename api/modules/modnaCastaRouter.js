let router = require("express").Router();
let axios = require("axios");
module.exports = router;

router.post("/", function(req, res, next) {
  const data = { items: [...req.body.data] };
  axios.defaults.headers.common["Authorization"] = req.headers.authorization;

  console.log(data);
  axios
    .post("https://hub.modnakasta.ua/api/products/update-stock/legacy", data)

    .then(({ data }) => {
      res.send(data);
    })
    .catch(err => console.log(err));
});
