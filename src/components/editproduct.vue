<template>
  <div class="edit container">
    <h1 class="page-header">Редактировать товар: {{product.id}}</h1>
    <hr>
    <form @submit="editProduct" class="row">
      <div class="col-4">
        <div class="col-12 mb-3">
          <img class="img-thumbnail" :src="product.product_photo">  
        </div>
        
        <div class="form-group col-12">
          <label for="url">Ссылка для фото:</label>
          <input class="form-control" type="text" v-model="product.product_photo">
          
        </div> 
      </div>
      <div class="col-8">
        <div class="row">
          <div class="form-group col-12">
            <div class="row">
              <div class="form-group col-4">
                <label for="code">Код товара:</label>
                <input type="text" class="form-control"  id="code" placeholder="Код товара" v-model="product.product_art">
              </div>
              <div class="form-group col-8">
                <label for="name">Название:</label>
                <input type="text" class="form-control" id="name" placeholder="Название" v-model="product.product_name">
              </div>
              <div class="form-group col-4">
                <label for="date">Дата добавления:</label>
                <input type="text" class="form-control" id="date"  placeholder="Дата добавления" v-model="product.createdAt" disabled>
              </div>
              <div class="form-group col-8">
                <label for="category">Категория товара</label>
                <select class="form-control" v-model="product.accCategoryId">
                  <option v-for="category in categories"
                          :key="category.id"
                          v-bind:value="category.id"
                          :selected = "category.id == product.accCategoryId ? true : false">
                          {{ category.category_name }}                        
                  </option>
                </select>
              </div>
              <div class="form-group col-4">
                <label for="status">Статус:</label>
                <select class="form-control" 
                        v-model="product.accProductStatusId"
                >
                  <option v-for="stat in status"
                          :key="stat.id"
                          v-bind:value="stat.id"
                         :selected = "stat.id == product.accProductStatusId ? true : false">
                          {{ stat.name }}                         
                  </option>
                </select>
              </div>
              <div class="form-group col-2">
                <label for="status">Ед.изм:</label>
                <select class="form-control" >
                  <option value="шт.">ШТ.</option>
                </select>
              </div>
              <div class="custom-control custom-checkbox col-6 d-flex align-items-center justify-content-end">
                <input type="checkbox" 
                        class="custom-control-input"
                        id="customCheck1"
                        v-model="product.product_const"
                        >
                <label class="custom-control-label" for="customCheck1"
                        >Постоянный ассортимент</label>
              </div>
            </div>
          </div>  
          <div class="form-group col-12">
            <div class="row">
              <div class="form-group col-4">
                <label for="url">URL:</label>
                <input type="text" class="form-control" id="url" placeholder="Url-адрес" v-model="product.product_url">
              </div>
              <div class="form-group col-8">
                <label for="exampleFormControlTextarea9">Примечания:</label>
                <textarea class="form-control" id="exampleFormControlTextarea9" rows="3" v-model="product.product_descr"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <ul class="nav nav-tabs options__tabs" @click="getTabBody">
        <li class="nav-item">
          <a class="nav-link" href="#" data-option="prices" >Цены</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" data-option="counts">Остатки</a>
        </li>
      </ul>
      <div class="col-12 row counts" v-if="this.tabName === 'counts'">
        <h5 class="col-12">Всего на остатке: {{this.totalCount}}</h5>
        <h5  class="col-12">Прибыль: {{this.totalSum}}</h5>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th># п/п</th>
              <th>Тип документа</th>
              <th>Номер документа</th>
              <th>Дата документа</th>
              <th>Количество</th>
              <th>Проведено</th>
              <th>Цена</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(count, index) in counts" :key="index">
              <td>{{index+1}}</td>
              <td>{{getDocumentType(count.document_type)}}</td>
              <td><span class="badge badge-success order-number" @click="editDocument(count.document_type, count.order_id)">{{count.order_id}}</span></td>
              <td>{{count.createdAt}}</td>
              <td>{{count.product_orderquant}}</td>
              <td>{{count.product_count}}</td>
              <td>{{count.product_price}}</td>
              <td>{{count.product_sum}}</td>
            </tr>
          </tbody>
        </table>    
      </div>
      <div class="col-12" v-if="this.tabName === 'prices'">
        <div class="row">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th># п/п</th>
                <th>Тип цены</th>
                <th>Цена</th>
                <th>Опции</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(price, index) in product.acc_product_prices"
                  :key="index"
              >
                <td>{{index+1}}</td>
                <td>
                  <select class="form-control" 
                          v-model="price.accPriceTypeId">
                    <option v-for="type in priceType" 
                          :key="type.id"
                          v-bind:value="type.id">
                          {{ type.price_name }}
                    </option>
                  </select>
                </td>
                <td>
                  <input type="text" class="form-control" v-model="price.price_count">
                </td>
                <td>
                  <button class="btn btn-outline-danger" @click="deletePrice" :data-id="index"><i class="far fa-trash-alt" :data-id="index"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-outline-info" @click="addPrice"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <hr>
      <div class="col-12 d-flex justify-content-end">
         <button type="submit" class="btn btn-success">Сохранить</button>
      </div>
    </form>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

export default {
  name: 'editProduct',
  props: ['productId'],
  data () {
    return {
      product: {},
      categories: [],
      status: [],
      priceType: [],
      tabName: 'prices',
      counts: [],
      totalCount: 0,
      totalSum: 0,
    }
  },    
  mounted: function () {
    this.getProductInfo();
  },
  methods: {
    getProductInfo: function () {
      axios(`${this.$store.state.host}/products/id/${this.productId}`)
        .then((response)=>{
          this.product = response.data;
          this.getCategory ();
          this.getStatus ();
          this.getPriceType ();
          console.log(this.product)
          
        });
    },
    getCategory () {
      axios(`${this.$store.state.host}/category`)
        .then((response)=>this.categories = response.data)
    },
    getStatus () {
      axios(`${this.$store.state.host}/status`)
        .then((response)=>this.status = response.data)
    },
    getPriceType () {
      axios(`${this.$store.state.host}/productpricetype`)
        .then((response)=>this.priceType = response.data)
    },
    deletePrice (e) {
      e.preventDefault();
      this.product.acc_product_prices.splice(e.target.dataset.id,1)
    },
    addPrice (e) {
      e.preventDefault();
      this.product.acc_product_prices.map((el)=>el.accProductId=this.product.id);
      this.product.acc_product_prices.push({
        accPriceTypeId : 1,
        accProductId : this.product.id,
        price_count: 0, 
        colId : this.count       
      })
      this.count = this.count + 1;     
    },
    editProduct (e) {
      e.preventDefault();
      axios({
        method : 'PUT',
        url : `${this.$store.state.host}/products/${this.product.id}`,
        headers : {
          'Content-type' : 'application/json',
        },
        data : {
          product_art : this.product.product_art,
          product_name : this.product.product_name,
          product_url : this.product.product_url,
          product_descr: this.product.product_descr,
          accCategoryId: this.product.accCategoryId,
          accProductStatusId: this.product.productStatusId,
          product_unit: this.product.product_unit,
          product_const: this.product.product_const,
          product_photo: this.product.product_photo
        }
      })
        .then (() => {
          axios({
            method : 'PUT',
            url : `${this.$store.state.host}/productprice`,
            headers : {
              'Content-type' : 'application/json',
            },
            data : {
              price: this.product.acc_product_prices,
              id: this.product.id
            }  
          })
            .then((response)=>console.log(response))
            .catch((err)=>console.log(err))
          this.$emit('editedProd') })
        .catch((error)=>console.log(error))
    },
    //переключение табов цена/остатки
    getTabBody (e) {
      this.tabName = e.target.dataset.option;
      this.getCounts ();
    },
    //выборка документов по данному товару
    getCounts () {
      axios.get(`${this.$store.state.host}/orderproducts/${this.productId}`)
        .then(res=>{
          this.totalCount = res.data.reduce((acc, el)=>acc+el.product_count, 0);
          this.totalSum = res.data.reduce((acc, el)=>acc+el.product_count*el.product_price, 0);
          this.counts = res.data
        })
        .catch(err=>console.log(err))
    },
    getDocumentType (type) {
      if (type === 1) {
        return 'Приход'
      } else if (type === 2) {
        return 'Расход'
      } else {
        return 'Неопределен'
      }
    },
    editDocument (type, id) {
      if (type === 1) {
        this.$emit('editPosting', id)
      } else if (type === 2) {
        this.$emit('editOrder', id)
      }
    },
  }
}
</script>
<style>
  hr {
    width: 100%;
  }
  .order-number {
    cursor: pointer;
  }
  .counts {
    max-height: 25vh;
    overflow-y: scroll
  }
</style>
