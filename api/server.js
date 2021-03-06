let express = require("express");
let app = express();
const globSync = require("glob").sync;
let cors = require("cors");
let bodyParser = require("body-parser");
let db = require("./modules/db").db;
let productsRouter = require("./modules/productsRouter");
let categoryRouter = require("./modules/categoryRouter");
let productStatus = require("./modules/productStatusRouter");
let productPrice = require("./modules/productPriceRouter");
let productPriceType = require("./modules/productPriceTypeRouter");
let ordersRouter = require("./modules/ordersRouter");
let orderProducts = require("./modules/orderProductsRouter");
let deliveryTypes = require("./modules/deliveryType");
let postingsRouter = require("./modules/postingsRouter");
let usersRouter = require("./modules/usersRouter");
let Casta = require("./modules/modnaCastaRouter");

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Method",
    "OPTIONS, POST, PUT, GET, HEAD, BODY"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, POST, PUT, GET, HEAD, BODY"
  );
  res.header("Allow", "OPTIONS, POST, PUT, GET, HEAD, BODY");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  next();
});

app.use("/products", productsRouter);
app.use("/category", categoryRouter);
app.use("/status", productStatus);
app.use("/productprice", productPrice);
app.use("/productpricetype", productPriceType);
app.use("/orders", ordersRouter);
app.use("/orderproducts", orderProducts);
app.use("/deliverytypes", deliveryTypes);
app.use("/postings", postingsRouter);
app.use("/users", usersRouter);
app.use("/casta", Casta);

app.listen(3012, function() {
  console.log("API app start...");
  db.sync({ force: false })
    .then(message => {
      console.log("Database is synced...");
    })
    .catch();
});
