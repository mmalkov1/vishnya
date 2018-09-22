import Vue from 'vue'
import App from './components/App.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import products from './components/products'
import addproduct from './components/addproduct'
import editProduct from './components/editproduct'
import orders from './components/orders.vue'
import addorder from './components/addorder.vue'
import Paginate from 'vuejs-paginate'
import SearchProduct from './components/searchProduct.vue'
import editOrder from './components/editorder.vue'
import postings from './components/postings.vue'
import addposting from './components/addposting.vue'
import editposting from './components/editposting.vue'
import store from './store/store'
import im_orders from './components/im_orders.vue'

Vue.use(VueResource)
Vue.use(VueRouter)

Vue.component('AppEditProduct', editProduct);
Vue.component('AppAddProduct', addproduct);
Vue.component('AppProducts', products);
Vue.component('paginate', Paginate);
Vue.component('orders', orders);
Vue.component('AddOrder', addorder);
Vue.component('SearchProduct', SearchProduct);
Vue.component('editOrder', editOrder);
Vue.component('appPostings', postings);
Vue.component('addPosting', addposting);
Vue.component('editPosting', editposting);
Vue.component('imOrder', im_orders)

new Vue({
  store,
  el: '#app',
  data: {},
  render: h => h(App)
})