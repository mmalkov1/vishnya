<template>
  <div>
    <div
      class="modal"
      :id="'exampleModal'+productId"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Редактирование цен</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body container">
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
                <tr
                  v-for="(price, index) in this.prices"
                  :key="index"
                  v-if="isShownPrice(price.accPriceTypeId)"
                >
                  <td>{{index+1}}</td>
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
                    <button class="btn btn-outline-danger" :data-id="index" @click="deletePrice">
                      <i class="far fa-trash-alt" :data-id="index"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              На остатке товара -
              <b>{{productCount}}шт.</b>
              по цене
              <b>{{priceBuy}}</b>
              на сумму
              <b>{{productCount * priceBuy}}грн.</b>
            </p>
            <p>
              В приходе -
              <b>{{postingCount}}шт.</b>
              по цене
              <b>{{postingPrice}}</b>
              на сумму
              <b>{{postingCount * postingPrice}}грн.</b>
            </p>
            <p>
              Рекомендуемая новая цена закупки:
              <span
                class="alert alert-success new-price"
                @click="setNewPrice"
              >{{Math.round((productCount * priceBuy + postingCount * postingPrice)/(+productCount+ +postingCount))}}грн.</span>
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="editPrice">Сохранить</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
          </div>
        </div>
      </div>
    </div>
    <button
      type="button"
      class="btn btn-outline-dark"
      data-toggle="modal"
      :data-target="'#exampleModal'+productId"
      @click="getPrices"
    >
      <i class="far fa-edit"></i>
    </button>
  </div>
</template>
<script>
import axios from "axios";

export default {
  props: ["productId", "postingCount", "postingPrice"],
  data() {
    return {
      id: 0,
      priceType: [],
      prices: [],
      productCount: 0,
      priceBuy: 0
    };
  },
  created() {
    this.getPriceType();
  },
  methods: {
    getPriceType() {
      axios(`${this.$store.state.host}/productpricetype`).then(
        response => (this.priceType = response.data)
      );
    },
    getPrices() {
      axios(`${this.$store.state.host}/productprice/${this.productId}`).then(
        response => {
          this.prices = response.data;
          this.priceBuy = response.data.find(
            el => el.accPriceTypeId === 1
          ).price_count;
          this.getProductCount();
        }
      );
    },
    getProductCount() {
      axios({
        method: "PUT",
        url: `${this.$store.state.host}/orderproducts/productid/`,
        data: [this.productId]
      })
        .then(res => {
          console.log(res.data);
          this.productCount = res.data
            .filter(el => el.documentStatus === 1)
            .reduce((acc, item) => acc + item.product_count, 0);
        })
        .catch(err => console.log(err));
    },
    setNewPrice() {
      this.prices.find(el => el.accPriceTypeId === 1).price_count = Math.round(
        (this.productCount * this.priceBuy +
          this.postingCount * this.postingPrice) /
          (+this.productCount + +this.postingCount)
      );
    },
    editPrice() {
      axios({
        method: "PUT",
        url: `${this.$store.state.host}/productprice`,
        headers: {
          "Content-type": "application/json"
        },
        data: {
          price: this.prices,
          id: this.productId
        }
      })
        .then(response => $("#exampleModal" + this.productId).modal("hide"))
        .catch(err => console.log(err));
    },
    deletePrice(e) {
      e.preventDefault();
      this.prices.splice(e.target.dataset.id, 1);
    },
    isShownPrice(priceid) {
      if (this.$store.state.role !== 1) {
        if (priceid !== 1) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  }
};
</script>
<style>
.new-price {
  cursor: pointer;
}
</style>
