<template>
  <div class="container">
    <h1 class="page-header">Добавить новый товар</h1>
    <hr>
    <form class="row">
      <div class="col-4 d-flex flex-column justify-content-end">
        <div class="form-group">
          <img
            class="img-thumbnail"
            :src="product.productPhoto"
            :alt="product.product_name"
            v-if="product.productPhoto"
          >
        </div>
        <div class="form-group">
          <label for="url">Ссылка для фото:</label>
          <input class="form-control" type="text" v-model="product.productPhoto">
        </div>
      </div>
      <div class="form-group col-8">
        <div class="col-12 row">
          <div class="form-group col-4">
            <label for="code">Код товара:</label>
            <input
              type="text"
              class="form-control"
              v-model="product.productArt"
              id="code"
              placeholder="Код товара"
            >
          </div>
          <div class="form-group col-8">
            <label for="name">Название:</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="product.productName"
              placeholder="Название"
            >
          </div>
        </div>
        <div class="col-12 row">
          <div class="form-group col-4">
            <label for="date">Дата добавления:</label>
            <input
              type="text"
              class="form-control"
              id="date"
              placeholder="Дата добавления"
              disabled
              v-model="now"
            >
          </div>
          <div class="form-group col-8">
            <label for="category">Категория товара</label>
            <select class="form-control" v-model="product.productParent">
              <option
                v-for="category in categories"
                :key="category.id"
                v-bind:value="category.id"
              >{{ category.category_name }}</option>
            </select>
          </div>
        </div>
        <div class="col-12 row">
          <div class="form-group col-4">
            <label for="status">Статус:</label>
            <select class="form-control" v-model="product.productStatus">
              <option v-for="stat in status" :key="stat.id" v-bind:value="stat.id">{{ stat.name }}</option>
            </select>
          </div>
          <div class="form-group col-2">
            <label for="status">Ед.изм:</label>
            <select class="form-control" v-model="product.productUnit">
              <option value="шт.">ШТ.</option>
            </select>
          </div>
          <div
            class="custom-control custom-checkbox col-6 d-flex align-items-center justify-content-end"
          >
            <input
              type="checkbox"
              class="custom-control-input"
              id="customCheck1"
              v-model="product.productConst"
              true-value="1"
              false-value="0"
            >
            <label class="custom-control-label" for="customCheck1">Постоянный ассортимент</label>
          </div>
        </div>
        <div class="col-12 row">
          <div class="form-group col-4">
            <label for="url">URL:</label>
            <input
              type="text"
              class="form-control"
              v-model="product.productUrl"
              id="url"
              placeholder="Url-адрес"
            >
          </div>
          <div class="form-group col-8">
            <label for="exampleFormControlTextarea9">Примечания:</label>
            <textarea
              class="form-control"
              v-model="product.productComment"
              id="exampleFormControlTextarea9"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
      <hr>
      <div class="form-group col-12">
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
              <tr v-for="(price, index) in product.acc_product_prices" :key="index">
                <td>{{price.colId}}</td>
                <td>
                  <select class="form-control" v-model="price.accPriceTypeId">
                    <option
                      v-for="type in priceType"
                      :key="type.id"
                      v-bind:value="type.id"
                    >{{ type.price_name }}</option>
                  </select>
                </td>
                <td>
                  <input type="text" class="form-control" v-model="price.price_count">
                </td>
                <td>
                  <button class="btn btn-outline-danger" @click="deletePrice" :data-id="index">
                    <i class="far fa-trash-alt" :data-id="index"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-outline-info" @click="addPrice">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <hr>
      <div class="col-12 row d-flex justify-content-end">
        <button type="submit" class="btn btn-success" @click="addProduct">Добавить продукт</button>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import VueResource from "vue-resource";
import moment from "moment";

export default {
  name: "addProduct",
  data() {
    return {
      product: {
        acc_product_prices: []
      },
      status: {},
      categories: {},
      priceType: [],
      count: 1
    };
  },
  created() {
    if (this.$store.state.userAuth === false) {
      return this.$router.replace({ path: "/auth" });
    }
    this.getStatus();
    this.getCategory();
    this.getPriceType();
  },
  computed: {
    now: function() {
      this.product.productDate = moment().format();
      return moment().format("YYYY-MM-DD HH:mm:ss");
    }
  },
  methods: {
    getCategory() {
      axios(`${this.$store.state.host}/category`).then(
        response => (this.categories = response.data)
      );
    },
    getStatus() {
      axios(`${this.$store.state.host}/status`).then(
        response => (this.status = response.data)
      );
    },
    getPriceType() {
      axios(`${this.$store.state.host}/productpricetype`).then(
        response => (this.priceType = response.data)
      );
    },
    deletePrice(e) {
      e.preventDefault();
      this.product.acc_product_prices.splice(e.target.dataset.id, 1);
    },
    addPrice(e) {
      e.preventDefault();
      this.product.acc_product_prices.push({
        accPriceTypeId: 1,
        accProductId: this.product.id,
        price_count: 0,
        colId: this.count
      });
      this.count = this.count + 1;
    },
    addProduct(e) {
      e.preventDefault();
      axios({
        method: "POST",
        url: `${this.$store.state.host}/products`,
        headers: {
          "Content-type": "application/json"
        },
        data: {
          product_art: this.product.productArt,
          product_name: this.product.productName,
          product_status: this.product.productStatus,
          product_dateadd: this.product.productDate,
          product_url: this.product.productUrl,
          product_descr: this.product.productComment,
          accCategoryId: this.product.productParent,
          accProductStatusId: this.product.productStatus,
          product_unit: this.product.productUnit,
          product_const: this.product.productConst,
          product_photo: this.product.productPhoto
        }
      })
        .then(response => {
          this.product.acc_product_prices.map(
            el => (el.accProductId = response.data.id)
          );
          axios({
            method: "POST",
            url: `${this.$store.state.host}/productprice`,
            headers: {
              "Content-type": "application/json"
            },
            data: {
              info: this.product.acc_product_prices,
              id: response.data.id
            }
          })
            .then(res => console.log(res))
            .catch(err => console.log(err));
          //this.$router.push("products");
          this.$emit("addProduct");
        })
        .catch(error => console.log(error));
    }
  }
};
</script>
<style>
.img-product {
  display: block;
  width: 100px;
}
</style>
