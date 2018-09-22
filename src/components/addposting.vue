<template>
  <div class="container">
    <h1>Добавить приход!</h1>
    <div class="order-head row col-12 mt-2 mb-2">
      <div class="form-group col-4">
        <label>Номер прихода:</label>
        <input type="text" class="form-control" v-model="postings.number">
      </div>
      <div class="form-group col-4">
        <label>Дата создания:</label>
        <input type="text" class="form-control" disabled=true>
      </div>
      <div class="form-group col-4">
        <label>Статус</label>
        <input type="text" class="form-control" v-model="postings.status" disabled=true>
      </div>
      <div class="form-group col-4">
        <label>Поставщик:</label>
        <input type="text" class="form-control" v-model="postings.provider">
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
          <tr v-for="(product, index) in postings.products" :key="product.id" class="align-middle">
            <td class="align-middle">{{index+1}}</td>
            <td class="align-middle">{{product.product_art}}</td>
            <td class="product__name align-middle">
              <search-product @productSelect="getProduct($event, index)"/>
              {{product.product_name}}</td>
            <td class="product__orderquant"><input type="text" v-model="product.product_orderquant" class="form-control"></td>
            <td class="align-middle">{{product.product_count}}</td>
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
      <button class="btn btn-outline-info" @click="addPostingProduct"><i class="fas fa-plus"></i></button>
    </div>
    <div class="col-12 mt-5">
      <button class="btn btn-primary" @click="addPosting('savePosting')">Сохранить</button>
      <button class="btn btn-success" @click="addPosting('catchPosting')">Сохранить и провести</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import VueResource from 'vue-resource'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'addPosting',
  props: ['productSelect'],
  data () {
    return {
      postings: {
        number: '',
        status: '',
        provider: '',
        documentStatus: '',
        products: []
      },
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
  computed: {
    total: function () {
      return this.postings.products.reduce((acc, el)=>acc+el.product_sum,0)
    }
  },
  methods: {
    //открыть-закрыть автокомплит и строку поиска
    openMenu () {
      this.isOpen = !this.isOpen; 
    },
    //добавление продуктов с таблицу из выпадающего списка
    getProduct(id, index) {
      let newProduct = this.postings.products[index];
      newProduct.product_id = id.id;
      newProduct.product_art = id.product_art;
      newProduct.product_name = id.product_name;
      newProduct.product_price = id.acc_product_prices.find(el=>el.accPriceTypeId==1).price_count;

      axios({
        method: 'PUT',
        url: `${this.$store.state.host}/orderproducts/productid/`,
        data: [id.id]
      })
      .then(res=>{
        console.log(res);
        newProduct.product_count = res.data.reduce((acc,el)=>acc+el.product_count,0)
      })
      .catch(err=>console.log(err))

    },
    //отправляем данные из формы на сервер
    addPosting (catchDocument) {
      axios({
        method : 'POST',
        url : `${this.$store.state.host}/postings`,
        headers : {
          'Content-type' : 'application/json',
        },
        data : {
          number: this.postings.number,
          status: catchDocument === 'savePosting' ? 'Новый' : 'Проведен',
          provider: this.postings.provider,
          total: this.total,
          documentStatus: catchDocument === 'savePosting' ? '' : 1
        }
      })
        .then((res)=> {
          //если заказ не проведен, то меняем статус на Новый
          this.postings.products.map((el)=>el.order_id=res.data.id)
          if(catchDocument && catchDocument==='savePosting') {
            this.postings.status = 'Новый'
          } 
          if(catchDocument && catchDocument==='catchPosting') {
            //если заказ проведен, то меняем статус на Проведен
            this.postings.status = 'Проведен';
            this.postings.products.map((el)=>el.product_count=el.product_orderquant)
            this.postings.products.map((el)=>el.documentStatus = 1)
          }  
            axios({
              //передаем товары по приходу на сервер.
              method : 'POST',
              url : `${this.$store.state.host}/orderproducts`,
              headers : {
                'Content-type' : 'application/json',
              },
              data : {
                info: this.postings.products,
              }
            })
              .then(()=>{                
                this.$emit('addPosting')})
              .catch((err)=>console.log(err))         
        })
        .catch((err)=>console.log(err))
    },
    addPostingProduct (e) {
      e.preventDefault();
      this.postings.products.push({
        product_id: 0,
        product_art: 0,
        product_name: '',
        product_orderquant: 1,
        product_count: 0,
        product_price: 0,
        product_sum: 0,
        documentStatus: '',
        document_type: 1 //тип документа - Приход
      })
    },
    productSum (quant, price, index) {
      return this.postings.products[index].product_sum = price * quant;
    },
    deleteProduct (e) {
      e.preventDefault();
      this.postings.products.splice(e.target.dataset.id,1)
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

