<template>
  <div id="table" class="container" v-if=" this.$store.state.userAuth === true">
    <loader v-if="this.isLoaded === true"></loader>
    <div class="row col-12 mt-3 justify-content-between">
      <div class="form-group col-4 row">
        <div>
          <button class="btn btn-success" @click="$emit('addProduct')">Добавить</button>
        </div>
        <select
          v-model="priceType.count"
          class="custom-select col-5 ml-auto"
          v-if=" this.$store.state.role === 1"
        >
          <option v-for="type in priceTypes" :key="type.id" :value="type.id">{{type.price_name}}</option>
        </select>
      </div>
      <div class="form-group col-4 row">
        <label for="find" class="col-3 align-self-center">Поиск</label>
        <input v-model="filter" class="form-control col-7" name="find">
      </div>
      <div class="form-group col-4 row" v-if="this.$store.state.role === 1">
        <datepicker
          :format="format"
          :language="ru"
          input-class="form-control col-12"
          class="col-5"
          v-model="startDate"
          :bootstrap-styling="true"
          :monday-first="true"
        ></datepicker>
        <datepicker
          :format="format"
          :language="ru"
          input-class="form-control col-12"
          class="col-5"
          v-model="endDate"
          :bootstrap-styling="true"
          :monday-first="true"
        ></datepicker>
        <div class="col-2">
          <download-excel
            :fetch="getLastOrderDate()"
            :data="productData"
            :fields="exportXlsFields"
            class="btn btn-primary btn-sm"
          >
            <i class="fas fa-cloud-download-alt"></i>
          </download-excel>
        </div>
      </div>
    </div>

    <table class="table table-striped">
      <thead>
        <tr @click="sortBy">
          <th id="id">id</th>
          <th id="product_art">Артикул</th>
          <th id="product_name">Название</th>
          <th id="acc_category">Группа товара</th>
          <th id="product_quantity">На остатке</th>
          <th id="acc_product_prices">Цена</th>
          <th>Примечание</th>
          <th>Опции</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in orderedProducts" :key="'product' + product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.product_art }}</td>
          <td>{{ product.product_name }}</td>
          <td>{{ categoryName(product.acc_category) }}</td>
          <td>{{ getProductQuantity(product.id)}} ({{ getProductReserved(product.id) }})</td>
          <td>{{ priceCount(product.acc_product_prices)}}</td>
          <td>{{ product.product_descr }}</td>
          <td>
            <button class="btn btn-primary" @click="$emit('editProduct', product.id)">
              <i class="far fa-edit"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <paginate
      v-model="page"
      :page-count="this.pageCount"
      :page-range="3"
      :margin-pages="2"
      :prev-text="'Назад'"
      :prev-class="'page-item'"
      :click-handler="getPage"
      :next-text="'Вперед'"
      :next-class="'page-item'"
      :prev-link-class="'page-link'"
      :next-link-class="'page-link'"
      :page-link-class="'page-link'"
      :container-class="'pagination justify-content-center'"
      :page-class="'page-item'"
    ></paginate>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import "babel-polyfill";
import moment from "moment";
import { setTimeout } from "timers";
import { ru } from "vuejs-datepicker/dist/locale";

export default {
  name: "productList",
  data() {
    return {
      isLoaded: false,
      ru: ru,
      productData: [],
      startDate: new Date(),
      endDate: new Date(),
      format: "dd.MM.yy",
      priceType: {
        default: 1,
        count: 2
      },
      productCount: [],
      orderProducts: [],
      reserved: [],
      priceTypes: [],
      sort: "id",
      ordered: "asc",
      orderArr: ["asc", "desc"],
      filter: "",
      page: 1,
      currentPosition: 0,
      lastPosition: 10,
      exportXlsFields: {
        Название: "product_name",
        Артикул: "product_art",
        "Ед. изм": "product_unit",
        "Цена закупки": {
          field: "acc_product_prices",
          callback: value => {
            return value.find(el => el.accPriceTypeId === 1).price_count;
          }
        },
        "Количество на остатке": {
          field: "id",
          callback: value => {
            let res = this.orderProducts
              .filter(el => el.product_id === value && el.documentStatus === 1)
              .reduce((acc, item) => acc + item.product_count, 0);
            if (res === 0) {
              return null;
            } else {
              return res;
            }
          }
        },
        "Количество в резерве": {
          field: "id",
          callback: value => {
            let res = this.orderProducts
              .filter(
                el =>
                  el.product_id == value &&
                  el.documentStatus !== 1 &&
                  el.document_type === 2
              )
              .reduce((acc, item) => acc + item.product_count, 0);
            if (res === 0) {
              return null;
            } else {
              return res * -1;
            }
          }
        },
        Продано: {
          field: "id",
          callback: value => {
            let res = this.orderProducts
              .filter(
                el =>
                  el.product_id === value &&
                  el.documentStatus === 1 &&
                  el.document_type === 2 &&
                  moment(el.createdAt).isSameOrAfter(this.startDate) &&
                  moment(el.createdAt).isSameOrBefore(this.endDate)
              )
              .reduce((acc, item) => acc + item.product_count, 0);
            if (res === 0) {
              return null;
            } else {
              return res * -1;
            }
          }
        },
        "Сумма продажи": {
          field: "id",
          callback: value => {
            let res = this.orderProducts
              .filter(
                el =>
                  el.product_id === value &&
                  el.documentStatus === 1 &&
                  el.document_type === 2 &&
                  moment(el.createdAt).isSameOrAfter(this.startDate) &&
                  moment(el.createdAt).isSameOrBefore(this.endDate)
              )
              .reduce((acc, item) => acc + item.product_sum, 0);
            if (res === 0) {
              return null;
            } else {
              return res;
            }
          }
        },
        Прибыль: {
          field: "id",
          callback: value => {
            let resPrice = this.productData
              .find(el => el.id === value)
              .acc_product_prices.find(item => item.accPriceTypeId === 1)
              .price_count;
            let resSumBuy = this.orderProducts
              .filter(
                el =>
                  el.product_id === value &&
                  el.documentStatus === 1 &&
                  el.document_type === 2 &&
                  moment(el.createdAt).isSameOrAfter(this.startDate) &&
                  moment(el.createdAt).isSameOrBefore(this.endDate)
              )
              .reduce((acc, item) => acc + item.product_count * resPrice, 0);
            let resSumSale = this.orderProducts
              .filter(
                el =>
                  el.product_id === value &&
                  el.documentStatus === 1 &&
                  el.document_type === 2 &&
                  moment(el.createdAt).isSameOrAfter(this.startDate) &&
                  moment(el.createdAt).isSameOrBefore(this.endDate)
              )
              .reduce((acc, item) => acc + item.product_sum, 0);
            let res = resSumSale - resSumBuy * -1;
            if (res === 0) {
              return null;
            } else {
              return res;
            }
          }
        },
        "Дата последней продажи": {
          field: "id",
          callback: value => {
            let res = this.orderProducts
              .filter(
                el =>
                  el.product_id === value &&
                  el.documentStatus === 1 &&
                  el.document_type === 2 &&
                  moment(el.createdAt).isSameOrAfter(this.startDate) &&
                  moment(el.createdAt).isSameOrBefore(this.endDate)
              )
              .reduce(
                (prev, curr) =>
                  moment(prev) < moment(curr.updatedAt) ? curr.updatedAt : prev,
                0
              );
            if (res === 0) {
              return null;
            } else {
              return moment(res).format("DD.MM.YYYY");
            }
          }
        }
      }
    };
  },
  computed: {
    orderedProducts: function() {
      if (!this.filter) {
        return _.slice(
          _.orderBy(this.productData, this.sort, this.ordered),
          this.currentPosition,
          this.lastPosition
        );
      } else {
        return _.slice(
          _.orderBy(
            _.filter(this.productData, o => {
              return (
                _.includes(o.product_name, this.filter) ||
                _.includes(o.product_art, this.filter) ||
                o.id == this.filter
              );
            }),
            this.sort,
            this.ordered
          ),
          this.currentPosition,
          this.lastPosition
        );
      }
    },
    pageCount: function() {
      if (!this.filter) {
        return Math.ceil(this.productData.length / 10);
      } else {
        return Math.ceil(
          _.filter(this.productData, o => {
            return _.includes(o.product_name, this.filter);
          }).length / 10
        );
      }
    },
    idArr: function() {
      let newArr1 = [];
      this.orderedProducts.reduce((acc, el) => newArr1.push(el.id), []);
      return newArr1;
    }
  },
  created() {
    this.isLoaded = true;
    this.getAnswer();
    this.getPriceType();
  },

  methods: {
    getLastOrderDate: function() {
      axios
        .get(`${this.$store.state.host}/orderproducts`)
        .then(res => {
          this.orderProducts = res.data;
        })
        .catch(err => console.log(err));
    },
    categoryName: function(cat) {
      if (cat != null) {
        return cat.category_name;
      }
    },
    sortBy(e) {
      if (this.sort === e.target.id) {
        this.ordered = this.orderArr.filter(el => el != this.ordered);
        // this.getProductCount();
      } else {
        this.sort = e.target.id;
        //this.getProductCount();
      }
    },
    getPage(e) {
      this.currentPosition = (e - 1) * 10;
      this.lastPosition = this.currentPosition + 10;
      // this.getProductCount();
    },
    getPriceType() {
      axios(`${this.$store.state.host}/productpricetype`).then(
        response => (this.priceTypes = response.data)
      );
    },
    priceCount: function(prc) {
      if (prc.length != 0 && prc != null) {
        let PrcCount = prc.find(
          el => el.accPriceTypeId == this.priceType.count
        );
        if (PrcCount == undefined) {
          return 0;
        } else {
          return PrcCount.price_count;
        }
      }
    },

    async getAnswer() {
      try {
        let response = await axios.get(`${this.$store.state.host}/products`);
        this.totalProducts = response.data.length;
        this.productData = response.data;
        await this.productData.map(el => {
          el.product_quant = 0;
          el.product_reserved = 0;
        });
        await this.productData.map(el => (el.lastSaleDate = ""));
        //await this.getLastOrderDate();
        this.isLoaded = false;
      } catch (error) {
        console.log(error);
      }
    },

    getProductCount() {
      axios({
        method: "PUT",
        url: `${this.$store.state.host}/orderproducts/productid/`,
        data: this.idArr
      })
        .then(res => {
          this.productCount = res.data.filter(el => el.documentStatus === 1);
          this.reserved = res.data.filter(el => el.documentStatus !== 1);
        })
        .catch(err => console.log(err));
    },

    getProductQuantity(id) {
      let res = this.productCount
        .filter(el => el.product_id == id)
        .reduce((acc, item) => acc + item.product_count, 0);
      return res;
    },

    getProductReserved(id) {
      let res = this.reserved
        .filter(el => el.product_id == id)
        .reduce((acc, item) => acc + item.product_count, 0);
      return res;
    }
  },
  watch: {
    idArr: function() {
      this.getProductCount();
    }
  }
};
</script>
<style>
th {
  cursor: pointer;
  position: relative;
}
.btn-primary a {
  color: white;
}
</style>
