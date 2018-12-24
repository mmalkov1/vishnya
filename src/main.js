import Vue from "vue";
import App from "./components/App.vue";
import VueRouter from "vue-router";
import VueResource from "vue-resource";
import products from "./components/products";
import addproduct from "./components/addproduct";
import editProduct from "./components/editproduct";
import orders from "./components/orders.vue";
import addorder from "./components/addorder.vue";
import Paginate from "vuejs-paginate";
import SearchProduct from "./components/searchProduct.vue";
import editOrder from "./components/editorder.vue";
import postings from "./components/postings.vue";
import addposting from "./components/addposting.vue";
import editposting from "./components/editposting.vue";
import auth from "./components/auth.vue";
import store from "./store/store";
import im_orders from "./components/im_orders.vue";
import loader from "./components/loader.vue";
import npExpressDocument from "./components/npExpressDocument.vue";
import MaskedInput from "vue-masked-input";
import JsonExcel from "vue-json-excel";
import Datepicker from "vuejs-datepicker";

Vue.use(VueResource);
Vue.use(VueRouter);

Vue.component("AppEditProduct", editProduct);
Vue.component("AppAddProduct", addproduct);
Vue.component("AppProducts", products);
Vue.component("paginate", Paginate);
Vue.component("orders", orders);
Vue.component("AddOrder", addorder);
Vue.component("SearchProduct", SearchProduct);
Vue.component("editOrder", editOrder);
Vue.component("appPostings", postings);
Vue.component("addPosting", addposting);
Vue.component("editPosting", editposting);
Vue.component("auth", auth);
Vue.component("imOrder", im_orders);
Vue.component("npDocument", npExpressDocument);
Vue.component("MaskedInput", MaskedInput);
Vue.component("downloadExcel", JsonExcel);
Vue.component("loader", loader);
Vue.component("datepicker", Datepicker);

//var Products = require("./components/products.vue").default;

const routes = [
  { path: "/products", component: products },
  { path: "/orders", component: orders }
];

var router = new VueRouter({
  routes
});

new Vue({
  store,
  // el: "#app",
  router: router
  //data: {}
  //render: h => h(App)
}).$mount("#app");
