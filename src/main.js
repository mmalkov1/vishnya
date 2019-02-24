import Vue from "vue";
import App from "./components/App.vue";
import VueRouter from "vue-router";
import VueResource from "vue-resource";
import products from "./components/products";
import addproduct from "./components/addproduct";
import editProduct from "./components/editproduct";
import appHeader from "./components/header.vue";
import orders from "./components/orders.vue";
import addorder from "./components/addorder.vue";
import Paginate from "vuejs-paginate";
import SearchProduct from "./components/searchProduct.vue";
import editOrder from "./components/editorder.vue";
import postings from "./components/postings.vue";
import addposting from "./components/addposting.vue";
import editposting from "./components/editposting.vue";
import auth from "./components/auth.vue";
import notFound from "./components/404.vue";
import returnProduct from "./components/returnProduct.vue";
import store from "./store/store";
import im_orders from "./components/im_orders.vue";
import loader from "./components/loader.vue";
import npExpressDocument from "./components/npExpressDocument.vue";
import modnaCastaSync from "./components/modnaCastaSync.vue";
import ModalPrice from "./components/modal-price.vue";
import MaskedInput from "vue-masked-input";
import JsonExcel from "vue-json-excel";
import Datepicker from "vuejs-datepicker";

Vue.use(VueResource);
Vue.use(VueRouter);

Vue.component("paginate", Paginate);
Vue.component("SearchProduct", SearchProduct);
Vue.component("npDocument", npExpressDocument);
Vue.component("MaskedInput", MaskedInput);
Vue.component("downloadExcel", JsonExcel);
Vue.component("loader", loader);
Vue.component("appHeader", appHeader);
Vue.component("datepicker", Datepicker);
Vue.component("modalPrice", ModalPrice);
Vue.component("returnProduct", returnProduct);
Vue.component("modnaCastaSync", modnaCastaSync);

const routes = [
  { path: "/auth", component: auth },
  { path: "/products", component: products },
  { path: "/products/add", component: addproduct },
  { path: "/products/:id", name: "products", component: editProduct },
  { path: "/orders", component: orders },
  { path: "/orders/add", component: addorder },
  { path: "/orders/:id", name: "orders", component: editOrder },
  { path: "/postings", component: postings },
  { path: "/postings/add", component: addposting },
  { path: "/postings/:id", name: "postings", component: editposting },
  { path: "/market", component: im_orders },
  { path: "/modal", component: ModalPrice },
  { path: "/casta", component: modnaCastaSync },
  { path: "/", component: auth },
  { path: "*", component: notFound }
];

var router = new VueRouter({
  routes
});

new Vue({
  store,
  router: router
}).$mount("#app");
