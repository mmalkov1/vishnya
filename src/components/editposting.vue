<template>
  <div class="container">
    <h1>Приход товара № {{postingId}}</h1>
    <div class="order-head row col-12 mt-2 mb-2">
      <div class="form-group col-4">
        <label>Номер заказа:</label>
        <input type="text" class="form-control" v-model="posting.number">
      </div>
      <div class="form-group col-4">
        <label>Дата создания:</label>
        <input type="text" class="form-control" disabled=true v-model="posting.createdAt">
      </div>
      <div class="form-group col-4">
        <label>Статус</label>
        <input type="text" class="form-control" v-model="posting.status" disabled="true">
      </div>
      <div class="form-group col-4">
        <label>Клиент:</label>
        <input type="text" class="form-control" v-model="posting.provider">
      </div>
    </div>
    <hr>
    <div class="order-body row col-12 mt-4 ">
      <h4>Список товаров:</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th># п/п</th>
            <th>Артикул</th>
            <th>Наименование товара</th>
            <th>Кол-во</th>
            <th>На остатке<br>(в резерве)</th>
            <th>Цена, грн</th>
            <th>Сумма, грн</th>
            <th>Опции</th>
          </tr>
        </thead>
        <tbody>
          <tr class="align-middle" v-for="(product,index) in products" :key="index">
            <td class="align-middle">{{index+1}}</td>
            <td class="align-middle">{{product.product_art}}</td>
            <td class="product__name align-middle">
              <search-product @productSelect="getProduct($event, index)" v-if="product.product_name==''"/>{{product.product_name}}</td>
            <td class="product__orderquant">
              <input type="text" class="form-control" v-show="showElement" v-model="product.product_orderquant">
              <span v-show="!showElement">{{product.product_orderquant}}</span>
            </td>
            <td class="align-middle">{{getProductQuantity (product.product_id)}} ({{getProductCatch (product.product_id)}})</td>
            <td class="product__price">
              <input type="text" class="form-control" v-show="showElement" v-model="product.product_price"/>
              <span v-show="!showElement">{{isShownValue(product.product_price)}}</span></td>
            <td class="align-middle">{{isShownValue(totalProduct(product.product_orderquant, product.product_price, index))}}</td>
            <td class="options">
              <button class="btn btn-outline-danger" :data-id="index" v-show="showElement" @click="deleteProduct"><i class="far fa-trash-alt" :data-id="index"></i></button>
            </td>
          </tr>
          <tr>
            <td colspan="5"></td>
            <td class="total__text">ИТОГО:</td>
            <td colspan="2" class="total__price">{{this.totalPosting}}</td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-outline-info" v-show="showElement" @click="addPostingProduct"><i class="fas fa-plus"></i></button>
    </div>
    <div class="col-12 mt-5">
      <button class="btn btn-primary" v-show="showElement" @click="savePosting">Сохранить</button>
      <button class="btn btn-success" v-show="showElement" @click="catchPosting">Сохранить и провести</button>
      <button class="btn btn-danger" v-show="!showElement" @click="cancelCatchPosting">Отменить проведение</button>
    </div>
  </div>  
</template>
<script>
import axios from 'axios'
import VueResource from 'vue-resource'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'editPosting',
  props: ['postingId'],
  data () {
    return {
      posting: {
        total: 0
      },
      products: [],
      counts: [],
    }
  },
  mounted: function () {
    this.getPosting();
  },
  computed: {
    showElement () {
      if (this.posting.status === 'Новый') {
        return true
      } else {
        return false
      }
    },
    totalPosting () {
      return this.products.reduce((acc, el)=>acc+el.product_sum,0)
    },
    arrProductId () {
      let newarr = [];
      for (let product of this.products) {
        newarr.push(product.product_id)
      }  
      return newarr; 
    }
  },
  methods: {
    //проверка на права пользователя
    isShownValue (value) {
      if (this.$store.state.role === 1) {
        return value
      } else {
        return '';
      }
    },
    //добавление продуктов с таблицу из выпадающего списка
    getProduct(id, index) {
      let newProduct = this.products[index];
      newProduct.product_id = id.id;
      newProduct.product_art = id.product_art;
      newProduct.product_name = id.product_name;
      newProduct.order_id = this.postingId
      newProduct.product_price = id.acc_product_prices.find(el=>el.accPriceTypeId==1).price_count;

      axios({
        method: 'PUT',
        url: `${this.$store.state.host}/orderproducts/productid/`,
        data: [id.id]
      })
      .then(res=>{
        newProduct.product_count = res.data.reduce((acc,el)=>acc+el.product_count,0)
      })
      .catch(err=>console.log(err))
    },
    getPosting() {
      axios.get(`${this.$store.state.host}/postings/id/${this.postingId}`)
        .then(res=>{
          this.posting = res.data;
          this.getPostingProducts();
          this.getProductCounts()
        })
        .catch(err=>console.log(err))
    },
    getDeltype() {
      axios.get(`${this.$store.state.host}/deliverytypes`)
        .then(res=>this.delType = res.data)
        .catch(err=>console.log(err))
    },
    getPostingProducts() {
      axios.get(`${this.$store.state.host}/orderproducts/id/1/${this.postingId}`)
        .then(res=>{this.products=res.data})
        .catch(err=>console.log(err))
    },
    addPostingProduct (e) {
      e.preventDefault();
      this.products.push({
        product_id: 0,
        product_art: 0,
        product_name: '',
        product_orderquant: 1,
        product_count: 0,
        product_price: 0,
        product_sum: 0,
        documentStatus: 0,
        document_type: 1
      })
    },
    deleteProduct (e) {
      e.preventDefault();
      this.products.splice(e.target.dataset.id,1)
    },
    cancelCatchPosting () {
      this.posting.status = 'Новый'
      this.products.map(el=>el.product_count=null)
      this.products.map(el=>el.documentStatus='');
      this.posting.documentStatus = '';
      axios({
        method: 'PUT',
        url: `${this.$store.state.host}/orderproducts/id/1/${this.postingId}`,
        data: this.products
      })
        .then(res=>console.log(res))
       this.savePosting ();  
    },
    catchPosting () {
      this.products.map(el=>el.product_count=el.product_orderquant);
      this.products.map(el=>el.documentStatus=1);
      this.posting.documentStatus = 1;
      axios({
        method: 'PUT',
        url: `${this.$store.state.host}/orderproducts/id/1/${this.postingId}`,
        data: this.products
      })
        .then(res=>console.log(res))
      this.posting.status = 'Проведен';
      this.posting.total = this.totalPosting;
      axios({
        method: 'PUT',
        url: `${this.$store.state.host}/postings/id/${this.postingId}`,
        data : Object.assign({},this.posting)
      })
        .then(res=> console.log(res))
        .catch(err=>console.log(err))
    },
    totalProduct (quant, price, index) {
      return this.products[index].product_sum = quant*price
    },
    savePosting () {
      this.posting.total = this.totalPosting;
      axios({
        method: 'PUT',
        url: `${this.$store.state.host}/postings/id/${this.postingId}`,
        data : Object.assign({},this.posting)
      })
        .then(res=> {
          this.getProductCounts()
          this.products.map(el=>el.product_count=0);
          this.products.map(el=>el.documentStatus=0);
          this.posting.documentStatus = 1;
          axios({
            method: 'PUT',
            url: `${this.$store.state.host}/orderproducts/id/1/${this.postingId}`,
            data: this.products
          })
            .then(result=>console.log(result))
        })
        .catch(err=>console.log(err)) 
    },
    getProductCounts: _.debounce(function () {
      axios({
        method: 'PUT',
        url: `${this.$store.state.host}/orderproducts/productid/`, 
        data: this.arrProductId
      })
      .then(res=>{
        this.counts = res.data;
      })
      .catch(err=>console.log(err))
    }, 100),
    getProductQuantity (id) {
      return this.counts.filter(el=>el.product_id==id && el.documentStatus == 1).reduce((acc, item)=>acc + item.product_count,0)
    },
    getProductCatch (id) {
      return this.counts.filter(el=>el.product_id==id && el.documentStatus !== 1).reduce((acc, item)=>acc + item.product_count,0)*(-1)
    }
  }   
}
</script>
<style>


</style>
