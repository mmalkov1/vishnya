<template>
  <div>
    <appHeader/>
    <div class="container">
      <loader v-if="this.isLoaded === true"></loader>
      <h1>Список заказов</h1>
      <div class="col-12 mt-3 row">
        <div class="col-2">
          <router-link class="btn btn-success" to="/orders/add">Добавить</router-link>
        </div>

        <div class="form-group col-4 row">
          <label for="find" class="col-3 mr-1">Поиск</label>
          <input class="form-control col-8" name="find" v-model="filter">
        </div>

        <div class="form-group col-6 row justify-content-end" v-if="this.$store.state.role === 1">
          <datepicker
            :format="format"
            :language="ru"
            input-class="form-control col-12"
            class="col-3"
            v-model="startDate"
            :bootstrap-styling="true"
            :monday-first="true"
          ></datepicker>
          <datepicker
            :format="format"
            :language="ru"
            input-class="form-control col-12"
            class="col-3"
            v-model="endDate"
            :bootstrap-styling="true"
            :monday-first="true"
          ></datepicker>
          <div class="col-2 d-flex justify-content-end align-items-baseline">
            <download-excel
              :data="filterDateOrders(orders)"
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
            <th id="id">Номер заказа</th>
            <th id="date">Дата создания</th>
            <th id>Товар</th>
            <th id="client">Клиент</th>
            <th id>Комментарии</th>
            <th id="status">Статус заказа</th>
            <th id="sourceOrder">Источник</th>
            <th id>Способ доставки</th>
            <th id="deliveryStatus">Статус доставки</th>
            <th id>Сумма</th>
            <th>Опции</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orderedOrder" :key="order.id">
            <td>{{order.id}}</td>
            <td class="small">{{dateFormat(order.createdAt)}}</td>
            <td
              class="small"
            >{{getProductName(order.acc_orderproducts)}} (арт. {{order.acc_orderproducts[0].product_art}})</td>
            <td class="client-name">
              <span>{{order.clientSurname}} {{order.clientName}}</span>
              <p>{{order.clientPhone}}</p>
              <small>{{order.clientEmail}}</small>
            </td>
            <td>{{order.comment}}</td>
            <td>{{order.status}}</td>
            <td class="small">{{order.sourceOrder}}</td>
            <td>
              <small>{{order.delType}}</small>
            </td>
            <td>
              <small>{{order.deliveryStatus}}</small>
            </td>
            <td>{{order.total}}</td>
            <td>
              <router-link
                class="btn btn-outline-dark"
                :to="{name: 'orders', params: { id: order.id}}"
              >
                <i class="far fa-edit"></i>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <paginate
        v-model="page"
        :page-count="this.pageCount"
        :click-handler="getPage"
        :page-range="3"
        :margin-pages="2"
        :prev-text="'Назад'"
        :prev-class="'page-item'"
        :next-text="'Вперед'"
        :next-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-link-class="'page-link'"
        :page-link-class="'page-link'"
        :container-class="'pagination justify-content-center'"
        :page-class="'page-item'"
      ></paginate>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import { ru } from "vuejs-datepicker/dist/locale";

export default {
  name: "orders",
  data() {
    return {
      orders: [],
      ru: ru,
      format: "dd.MM.yy",
      isLoaded: false,
      startDate: new Date(),
      endDate: new Date(),
      page: 1,
      currentPosition: 0,
      lastPosition: 10,
      sort: "id",
      ordered: "desc",
      orderArr: ["asc", "desc"],
      filter: "",
      exportXlsFields: {
        "Номер заказа": "id",
        Дата: {
          field: "createdAt",
          callback: date => {
            return moment(date).format("DD.MM.YYYY HH:mm:ss");
          }
        },
        Товары: {
          field: "acc_orderproducts",
          callback: products => {
            return products.map(el => `Товар: ${el.product_name}`);
          }
        },
        "Количество товаров": {
          field: "acc_orderproducts",
          callback: products => {
            return products.reduce((acc, el) => acc + 1, 0);
          }
        },
        Имя: "clientName",
        Фамилия: "clientSurname",
        Отчество: "clientSecondName",
        Телефон: "clientPhone",
        Комментарий: "comment",
        Сумма: "total",
        "Тип доставки": "delType",
        "Статус доставки": "deliveryStatus",
        Источник: "sourceOrder",
        "Статус заказа": "status"
      }
    };
  },
  created() {
    if (this.$store.state.userAuth === false) {
      return this.$router.replace({ path: "/auth" });
    }
    this.isLoaded = true;
    this.getOrderList();
  },

  computed: {
    pageCount: function() {
      if (!this.filter) {
        return Math.ceil(this.orders.length / 10);
      } else {
        return Math.ceil(
          _.filter(this.orders, o => {
            return _.includes(o.number, this.filter);
          }).length / 10
        );
      }
    },
    orderedOrder: function() {
      if (!this.filter) {
        return _.slice(
          _.orderBy(this.orders, this.sort, this.ordered),
          this.currentPosition,
          this.lastPosition
        );
      } else {
        return _.slice(
          _.orderBy(
            _.filter(this.orders, o => {
              return (
                _.includes(o.deliveryStatus, this.filter) ||
                _.includes(o.clientName, this.filter) ||
                _.includes(o.clientSurname, this.filter) ||
                _.includes(o.clientPhone, this.filter) ||
                _.includes(
                  o.acc_orderproducts[0].product_name.toLowerCase(),
                  this.filter
                ) ||
                _.includes(o.acc_orderproducts[0].product_art, this.filter) ||
                _.includes(o.createdAt, this.filter) ||
                _.includes(o.sourceOrder, this.filter) ||
                _.includes(o.comment, this.filter) ||
                _.includes(o.total, this.filter) ||
                _.includes(o.id + "", this.filter)
              );
            }),
            this.sort,
            this.ordered
          ),
          this.currentPosition,
          this.lastPosition
        );
      }
    }
  },
  methods: {
    filterDateOrders(orders) {
      return orders.filter(el =>
        moment(el.createdAt).isBetween(this.startDate, this.endDate)
      );
    },
    getProductName(productList) {
      if (productList && productList.length !== 0) {
        return productList[0].product_name;
      }
      return "Нет товара";
    },
    dateFormat(dateOrder) {
      return moment(dateOrder).format("YYYY-MM-DD HH:mm:ss");
    },
    fixOrderProducts(orders) {
      orders.map(item => {
        if (item.acc_orderproducts.length === 0) {
          item.acc_orderproducts.push({
            product_name: "",
            product_art: ""
          });
        }
      });
      return orders;
    },
    getOrderList() {
      axios(`${this.$store.state.host}/orders`)
        .then(res => {
          this.orders = this.fixOrderProducts(res.data);
          this.isLoaded = false;
        })
        .catch(err => console.log(err));
    },
    getPage(e) {
      this.currentPosition = (e - 1) * 10;
      this.lastPosition = this.currentPosition + 10;
    },
    sortBy(e) {
      if (this.sort === e.target.id) {
        this.ordered = this.orderArr.filter(el => el != this.ordered);
      } else {
        this.sort = e.target.id;
      }
    }
  }
};
</script>
<style>
.client-name {
  width: 20%;
}
.date-order {
  font-size: 0.8rem;
}
</style>
