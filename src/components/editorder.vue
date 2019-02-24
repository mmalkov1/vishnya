<template>
  <div>
    <appHeader></appHeader>
    <div class="container">
      <loader v-if="this.isLoaded === true"></loader>
      <div class="header-block">
        <h1 class="header-text">Заказ № {{this.$route.params.id}}</h1>
        <small class="header-status alert" :class="this.classAlert">{{order.status}}</small>
      </div>
      <div class="order-head row col-12 mt-2 mb-2">
        <div class="form-group col-8">
          <label>ФИО клиента:</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="order.clientSurname"
              placeholder="Фамилия"
            >
            <input type="text" class="form-control" v-model="order.clientName" placeholder="Имя">
            <input
              type="text"
              class="form-control"
              v-model="order.clientSecondName"
              placeholder="Отчество"
            >
          </div>
        </div>
        <div class="form-group col-4">
          <label>Телефон/e-mail клиента:</label>
          <div class="input-group">
            <masked-input
              type="text"
              class="form-control"
              v-model="order.clientPhone"
              mask="\+\380111111111"
              placeholder="Телефон"
            />
            <input
              type="text"
              class="form-control"
              v-model="order.clientEmail"
              placeholder="E-mail"
            >
          </div>
        </div>
        <div class="form-group col-3">
          <label>Источник заказа</label>
          <select class="custom-select" v-model="order.sourceOrder">
            <option v-for="source in sourceOrder" :key="'source-' + source.id">{{source.name}}</option>
          </select>
        </div>
        <div class="form-group col-3">
          <label>Дата создания:</label>
          <input type="text" class="form-control" disabled="true" v-model="order.createdAt">
        </div>
        <div class="form-group col-3">
          <label>Адрес доставки:</label>
          <input type="text" class="form-control" v-model="order.address">
        </div>
        <div class="form-group col-3">
          <label for="number">Способ доставки:</label>
          <select class="custom-select" v-model="order.delType">
            <option v-for="type in delType" :key="'type-' + type.id">{{type.name}}</option>
          </select>
        </div>
      </div>
      <hr>
      <div class="order-body row col-12 mt-4">
        <h4>Список товаров:</h4>
        <table class="table table-striped">
          <thead>
            <tr>
              <th># п/п</th>
              <th>Артикул</th>
              <th>Наименование товара</th>
              <th>Кол-во</th>
              <th>Остаток
                <br>резерв
              </th>
              <th>Цена, грн</th>
              <th>Сумма, грн</th>
              <th>Опции</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="align-middle"
              v-for="(product,index) in products"
              :key="'product-' + index"
              :class="{productReturn : product.product_orderquant < 0}"
            >
              <td class="align-middle">{{index+1}}</td>
              <td class="align-middle">{{product.product_art}}</td>
              <td class="product__name align-middle">
                <search-product
                  @productSelect="getProduct($event, index)"
                  v-if="product.product_name==''"
                />
                {{product.product_name}}
                <br>
                <small v-if="product.product_orderquant < 0">
                  <b>возврат:</b>
                  {{dateFormat(product.createdAt)}}
                </small>
              </td>
              <td class="product__orderquant">
                <input
                  type="text"
                  class="form-control"
                  v-show="showElement"
                  v-model="product.product_orderquant"
                >
                <span v-show="!showElement">{{product.product_orderquant}}</span>
              </td>
              <td
                class="align-middle"
              >{{getProductQuantity (product.product_id)}} ({{getProductCatch(product.product_id)}})</td>
              <td class="product__price">
                <input
                  type="text"
                  class="form-control"
                  v-show="showElement"
                  v-model="product.product_price"
                >
                <span v-show="!showElement">{{product.product_price}}</span>
              </td>
              <td
                class="align-middle"
              >{{totalProduct(product.product_orderquant, product.product_price, index)}}</td>
              <td class="options">
                <button
                  class="btn btn-outline-danger"
                  :data-id="index"
                  v-show="showElement"
                  @click="deleteProduct"
                >
                  <i class="far fa-trash-alt" :data-id="index"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td colspan="5"></td>
              <td class="total__text">ИТОГО:</td>
              <td colspan="2" class="total__price">{{this.totalOrder}}</td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-outline-info" v-show="showElement" @click="addOrderProduct">
          <i class="fas fa-plus"></i>
        </button>
      </div>

      <div class="col-12 mt-2 form-group">
        <label for>Комментарии к заказу:</label>
        <textarea rows="5" class="form-control" v-model="order.comment"></textarea>
      </div>
      <div class="col-12 mt-2 d-flex">
        <div class="col-6">
          <button class="btn btn-primary" @click="saveOrder">Сохранить</button>
          <button
            class="btn btn-success"
            v-show="showElement"
            @click="catchOrder"
          >Сохранить и провести</button>
          <button
            class="btn btn-outline-danger"
            v-show="!showElement && order.documentStatus !== 1"
            @click="cancelCatchOrder"
          >Отменить резерв</button>
          <button
            class="btn btn-outline-success"
            v-show="!showElement && order.documentStatus !== 1"
            @click="shipOrder"
          >Отгрузить</button>
          <button
            class="btn btn-outline-success"
            v-show="!showElement && order.documentStatus === 1"
            disabled="disabled"
          >Отгружен</button>
          <button
            class="btn btn-outline-danger"
            v-show="!showElement && order.documentStatus === 1"
            @click="cancelShipOrder"
          >Отменить отгрузку</button>
          <button type="button" class="btn btn-light" @click="goBack">Назад</button>
        </div>
        <div class="col-5 row mr-auto" v-show="!showElement && order.documentStatus === 1">
          <label for="number" class="col-6 text-right p-2">Статус посылки:</label>
          <select class="custom-select col-6 p-2" v-model="order.deliveryStatus">
            <option v-for="status in deliveryStatus" :key="'status-' + status.id">{{status.name}}</option>
          </select>
        </div>
        <div class="col" v-show="this.isDeclarationExist()">
          <span>Декларация: {{this.order.declarationNumber}}</span>
          <a
            :href="'https://my.novaposhta.ua/orders/printDocument/orders[]/'+ this.order.declarationRef + '/type/pdf/apiKey/' + this.$store.state.npToken"
            target="blank"
          >Печать ЭН</a>
          <a
            :href="'https://my.novaposhta.ua/orders/printMarkings/orders[]/'+ this.order.declarationRef + '/type/pdf/apiKey/' + this.$store.state.npToken"
            target="blank"
          >Печать маркеровки</a>
        </div>
        <np-document
          class="col-1"
          :order-data="this.order"
          :order-products="this.products"
          @addNPDocument="addDeclaration"
          v-show="!this.isDeclarationExist() && !showElement && order.documentStatus === 1"
        ></np-document>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import VueResource from "vue-resource";
import moment from "moment";
import _ from "lodash";
import MaskedInput from "vue-masked-input";
import { updateProductsInModnaKasta } from "../modules/modnaKasta/operationsModnaKasta.js";

export default {
  name: "editOrder",
  data() {
    return {
      order: {
        total: 0
      },
      isLoaded: false,
      products: [],
      delType: [],
      counts: [],
      deliveryStatus: [
        {
          id: 1,
          name: "На складе"
        },
        {
          id: 2,
          name: "Отправлено"
        },
        {
          id: 3,
          name: "Получено"
        },
        {
          id: 4,
          name: "Отказ от получения"
        }
      ],
      sourceOrder: [
        {
          id: 1,
          name: "Vishnya"
        },
        {
          id: 2,
          name: "Вишня"
        },
        {
          id: 3,
          name: "Вишня телефон"
        },
        {
          id: 4,
          name: "Малина"
        },
        {
          id: 5,
          name: "Малина телефон"
        },
        {
          id: 6,
          name: "OLX"
        },
        {
          id: 7,
          name: "Клубок"
        },
        {
          id: 8,
          name: "SHAFA"
        },
        {
          id: 9,
          name: "Kidstaff"
        },
        {
          id: 10,
          name: "Facebook"
        },
        {
          id: 11,
          name: "Instagramm"
        },
        {
          id: 12,
          name: "Rozetka"
        },
        {
          id: 13,
          name: "Дропшипинг"
        }
      ]
    };
  },
  created() {
    if (this.$store.state.userAuth === false) {
      return this.$router.replace({ path: "/auth" });
    }
  },
  mounted: function() {
    this.isLoaded = true;
    this.getOrder();
  },
  computed: {
    classAlert() {
      if (this.order.status === "Новый") {
        return "alert-secondary";
      } else if (this.order.status === "Зарезервирован") {
        return "alert-warning";
      } else if (this.order.status === "Выполнен") {
        return "alert-success";
      }
    },
    showElement() {
      if (this.order.status === "Новый") {
        return true;
      } else {
        return false;
      }
    },
    totalOrder() {
      return this.products.reduce((acc, el) => acc + el.product_sum, 0);
    },
    arrProductId() {
      let newarr = [];
      for (let product of this.products) {
        newarr.push(product.product_id);
      }
      return newarr;
    }
  },

  methods: {
    goBack() {
      this.$router.back();
    },
    dateFormat(date) {
      return moment(date).format("DD.MM.YYYY HH:mm:ss");
    },
    isDeclarationExist() {
      if (
        this.order.declarationNumber !== null &&
        this.order.declarationRef !== null
      ) {
        return true;
      } else {
        return false;
      }
    },
    addDeclaration(obj) {
      this.order.declarationNumber = obj.data[0].IntDocNumber;
      this.order.declarationRef = obj.data[0].Ref;
      this.saveOrder();
    },
    //добавление продуктов с таблицу из выпадающего списка
    getProduct(id, index) {
      let newProduct = this.products[index];
      newProduct.product_id = id.id;
      newProduct.product_art = id.product_art;
      newProduct.product_name = id.product_name;
      newProduct.order_id = this.$route.params.id;
      newProduct.product_price = id.acc_product_prices.find(
        el => el.accPriceTypeId == 1
      ).price_count;

      axios({
        method: "PUT",
        url: `${this.$store.state.host}/orderproducts/productid/`,
        data: [id.id]
      })
        .then(res => {
          newProduct.product_residue = res.data
            .filter(el => el.documentStatus === 1)
            .reduce((acc, el) => acc + el.product_count, 0);
          newProduct.product_catch = res.data
            .filter(el => el.documentStatus !== 1)
            .reduce((acc, el) => acc + el.product_count, 0);
          this.getProductCounts();
        })
        .catch(err => console.log(err));
    },
    getOrder() {
      axios
        .get(`${this.$store.state.host}/orders/id/${this.$route.params.id}`)
        .then(res => {
          this.order = res.data;
          this.getDeltype();
          this.getOrderProducts();
          this.getProductCounts();
        })
        .catch(err => console.log(err));
    },
    getDeltype() {
      axios
        .get(`${this.$store.state.host}/deliverytypes`)
        .then(res => (this.delType = res.data))
        .catch(err => console.log(err));
    },
    getOrderProducts() {
      axios
        .get(
          `${this.$store.state.host}/orderproducts/id/2/${
            this.$route.params.id
          }`
        )
        .then(res => {
          this.products = res.data;
          this.isLoaded = false;
        })
        .catch(err => console.log(err));
    },
    addOrderProduct(e) {
      e.preventDefault();
      this.products.push({
        product_id: 0,
        product_art: 0,
        product_name: "",
        product_orderquant: 1,
        product_count: null,
        product_price: 0,
        product_sum: 0,
        document_type: 2,
        wc_id: 0
      });
    },
    deleteProduct(e) {
      e.preventDefault();
      this.products.splice(e.target.dataset.id, 1);
    },
    cancelCatchOrder() {
      this.order.status = "Новый";
      this.products.map(el => (el.product_count = null));
      axios({
        method: "PUT",
        url: `${this.$store.state.host}/orderproducts/id/2/${
          this.$route.params.id
        }`,
        data: this.products
      }).then(res => console.log(res));
      this.saveOrder();
    },
    catchOrder() {
      this.products.map(el => (el.product_count = el.product_orderquant * -1));
      this.order.status = "Зарезервирован";
      axios({
        method: "PUT",
        url: `${this.$store.state.host}/orderproducts/id/2/${
          this.$route.params.id
        }`,
        data: this.products
      })
        .then(res => console.log(res))
        .catch(err => console.log(err));
      this.saveOrder();
    },
    shipOrder() {
      this.order.documentStatus = 1;
      this.order.status = "Выполнен";
      this.products.map(el => (el.documentStatus = 1));
      axios({
        method: "PUT",
        url: `${this.$store.state.host}/orderproducts/id/2/${
          this.$route.params.id
        }`,
        data: this.products
      })
        .then(res => {
          this.calculateProductTotal();
        })
        .catch(err => console.log(err));
      this.saveOrder();
    },
    cancelShipOrder() {
      this.order.documentStatus = "";
      this.order.status = "Зарезервирован";
      this.products.map(el => (el.documentStatus = ""));
      axios({
        method: "PUT",
        url: `${this.$store.state.host}/orderproducts/id/2/${
          this.$route.params.id
        }`,
        data: this.products
      })
        .then(res => {
          this.calculateProductTotal();
          this.saveOrder();
        })
        .catch(err => console.log(err));
    },
    totalProduct(quant, price, index) {
      return (this.products[index].product_sum = quant * price);
    },
    saveOrder() {
      this.order.total = this.totalOrder;
      axios({
        method: "PUT",
        url: `${this.$store.state.host}/orders/id/${this.$route.params.id}`,
        data: Object.assign({}, this.order)
      })
        .then(res => {
          this.getProductCounts();
        })
        .catch(err => console.log("Ошибка сохранения заказа" + err));
    },
    getProductCounts: _.debounce(function() {
      axios({
        method: "PUT",
        url: `${this.$store.state.host}/orderproducts/productid/`,
        data: this.arrProductId
      })
        .then(res => {
          this.counts = res.data;
          updateProductsInModnaKasta(this.arrProductId, this.counts);
        })
        .catch(err => console.log(err));
    }, 100),
    getProductQuantity(id) {
      return this.counts
        .filter(el => el.product_id == id && el.documentStatus === 1)
        .reduce((acc, item) => acc + item.product_count, 0);
    },
    getProductCatch(id) {
      return this.counts
        .filter(el => el.product_id == id && el.documentStatus !== 1)
        .reduce((acc, item) => acc + +item.product_count, 0);
    },
    updateSiteProduct(total, id) {
      this.isLoaded = true;
      if (total < 1) {
        axios.get(`${this.$store.state.host}/products/id/${id}`).then(prod => {
          let option = {
            auth: this.$store.state.wc,
            data: {
              in_stock: false
            },
            method: "PUT"
          };
          axios(
            `https://vishnya.org.ua/wp-json/wc/v2/products/${prod.data.wc_id}`,
            option
          )
            .then(res => {
              console.log(res);
              this.isLoaded = false;
            })
            .catch(error => console.log(error));
        });
      } else {
        axios.get(`${this.$store.state.host}/products/id/${id}`).then(prod => {
          let option = {
            auth: this.$store.state.wc,
            data: {
              in_stock: true
            },
            method: "PUT"
          };
          axios(
            `https://vishnya.org.ua/wp-json/wc/v2/products/${prod.data.wc_id}`,
            option
          )
            .then(res => {
              console.log(res);
              this.isLoaded = false;
            })
            .catch(error => console.log(error));
        });
      }
    },
    calculateProductTotal() {
      for (let elem of this.arrProductId) {
        let total = this.counts
          .filter(el => el.product_id == elem && el.documentStatus === 1)
          .reduce((acc, item) => acc + +item.product_count, 0);
        this.updateSiteProduct(total, elem);
      }
    }
  }
};
</script>
<style>
.header-status {
  display: inline-block;
  padding: 0.15rem 1rem;
  margin-left: 1rem;
  vertical-align: middle;
}
.header-text {
  display: inline;
}
.productReturn {
  color: red;
}
</style>
