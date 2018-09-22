<template>
  <div class="container">
    <h1>Добавить заказ!</h1>
    <div class="order-head row col-12 mt-2 mb-2">
      <div class="form-group col-4">
        <label>Номер заказа:</label>
        <input type="text" class="form-control" v-model="order.number">
      </div>
      <div class="form-group col-4">
        <label>Дата создания:</label>
        <input type="text" class="form-control" disabled=true>
      </div>
      <div class="form-group col-4">
        <label>Статус</label>
        <input type="text" class="form-control" v-model="order.status" disabled=true>
      </div>
      <div class="form-group col-4">
        <label>Клиент:</label>
        <input type="text" class="form-control" v-model="order.client">
      </div>
      <div class="form-group col-4">
        <label>Адрес:</label>
        <input type="text" class="form-control" v-model="order.address">
      </div>
      <div class="form-group col-4">
        <label for="number">Способ доставки:</label>
        <select class="custom-select" v-model="order.delType">
          <option v-for="type in deliveryType"
                  :key="type.id">{{type.name}}</option>
        </select>
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
            <th>На остатке<br>в резерве</th>
            <th>Цена, грн</th>
            <th>Сумма, грн</th>
            <th>Опции</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in order.products" :key="product.id" class="align-middle">
            <td class="align-middle">{{index+1}}</td>
            <td class="align-middle">{{product.product_art}}</td>
            <td class="product__name align-middle">
              <search-product @productSelect="getProduct($event, index)"/>
              {{product.product_name}}</td>
            <td class="product__orderquant"><input type="text" v-model="product.product_orderquant" class="form-control"></td>
            <td class="align-middle">{{product.product_count}} ({{product.product_catch}})</td>
            <td class="product__price"><input type="text" v-model="product.product_price" class="form-control"></td>
            <td class="align-middle">{{productSum(product.product_orderquant, product.product_price, index)}}</td>
            <td class="options">
              <button class="btn btn-outline-danger" @click="deleteProduct" :data-id="index"><i class="far fa-trash-alt" :data-id="index"></i></button>
            </td>
          </tr>
          <tr>
            <td colspan="5"></td>
            <td class="total__text">ИТОГО:</td>
            <td colspan="2" class="total__price">{{total}}</td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-outline-info" @click="addOrderProduct"><i class="fas fa-plus"></i></button>
    </div>
    <div class="col-12 mt-5">
      <button class="btn btn-primary" @click="addOrder('saveOrder')">Сохранить</button>
      <button class="btn btn-success" @click="addOrder('catchOrder')">Сохранить и провести</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import VueResource from 'vue-resource'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'addOrder',
  props: ['productSelect'],
  data () {
    return {
      order: {
        number: '',
        status: '',
        client: '',
        delType: '',
        address: '',
        products: []
      },
      deliveryType: [],
      countArr: [],
      query: '',
      isOpen: true,
    }
  },
  directives: {
    focus: {
      // определение директивы
      inserted: function (el) {
        el.focus()
      }
    }
  },
  created: function() {
    this.getDeliveryType()
  },
  computed: {
    total: function () {
      return this.order.products.reduce((acc, el)=>acc+el.product_sum,0)
    }
  },
  methods: {
    //открыть-закрыть автокомплит и строку поиска
    openMenu () {
      this.isOpen = !this.isOpen; 
    },
    //добавление продуктов с таблицу из выпадающего списка
    getProduct(id, index) {
      let newProduct = this.order.products[index];
      newProduct.product_id = id.id;
      newProduct.product_art = id.product_art;
      newProduct.product_name = id.product_name;
      newProduct.product_price = id.acc_product_prices.find(el=>el.accPriceTypeId==2).price_count;//цена розница

      axios({
        method: 'PUT',
        url: `${this.$store.state.host}/orderproducts/productid/`,
        data: [id.id]
      })
      .then(res=>{
        newProduct.product_count = res.data.filter(el=>el.documentStatus === 1).reduce((acc,el)=>acc+el.product_count,0)
        newProduct.product_catch = res.data.filter(el=>el.documentStatus !== 1).reduce((acc,el)=>acc+el.product_count,0)
      })
      .catch(err=>console.log(err))

    },
    getDeliveryType () {
      axios.get(`${this.$store.state.host}/deliverytypes`)
        .then(res=>this.deliveryType=res.data)
        .catch(err=>console.log(err))
    },
    addOrder (catchDocument) {
      axios({
        method : 'POST',
        url : `${this.$store.state.host}/orders`,
        headers : {
          'Content-type' : 'application/json',
        },
        data : {
          number: this.order.number,
          status: catchDocument === 'saveOrder' ? 'Новый' : 'Проведен',
          client: this.order.client,
          delType: this.order.delType,
          address: this.order.address,
          total: this.total
        }
      })
        .then((res)=> {
          this.order.products.map((el)=>el.order_id=res.data.id)
          if(catchDocument && catchDocument==='saveOrder') {
            this.order.status = 'Новый'
          } 
          if(catchDocument && catchDocument==='catchOrder') {
            this.order.status = 'Проведен';
            this.order.products.map((el)=>el.product_count=el.product_orderquant*(-1))
          }  
            axios({
              method : 'POST',
              url : `${this.$store.state.host}/orderproducts`,
              headers : {
                'Content-type' : 'application/json',
              },
              data : {
                info: this.order.products,
              }
            })
              .then(()=>{                
                this.$emit('addOrder')})
              .catch((err)=>console.log(err))         
        })
        .catch((err)=>console.log(err))
    },
    addOrderProduct (e) {
      e.preventDefault();
      this.order.products.push({
        product_id: 0,
        product_art: 0,
        product_name: '',
        product_orderquant: 1,
        product_count: 0,
        product_catch: 0,
        product_price: 0,
        product_sum: 0,
        document_type: 2
      })
    },
    productSum (quant, price, index) {
      return this.order.products[index].product_sum = price * quant;
    },
    deleteProduct (e) {
      e.preventDefault();
      this.order.products.splice(e.target.dataset.id,1)
    },
  }
}
</script>
<style>
  .art-group {
    position: relative;
  }
  .art-options {
    display: block;
    position: absolute;
    bottom: -100px;
    width: 100%;
    height: 100px;
    background-color: grey;
  }
  .search-group {
    position: relative;
  }
  .total__text {
    text-align: right;
  }
  .total__price,
  .total__text {
    font-size: 2rem;
  }
  .product__price {
    width: 10%;
  }
  .product__orderquant {
    width: 7%;
  }
  .product_name {
    width: 30%;
  }
</style>

