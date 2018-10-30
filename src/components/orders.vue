<template>
  <div class="container">
    <h1>Список заказов</h1>
    <div class="row col-12 mt-3">
      <div class="form-group col-6 row">
        <label for="find" class="col-3" >Поиск</label>
        <input class="form-control col-9" name="find" v-model="filter">
      </div>
      <div class="form-group col-5  ml-auto row">
        <div class="col-5  ml-auto">
          <button  class="btn btn-success"  @click="$emit('addOrder')">Добавить</button>
        </div>
      </div>
    </div> 
    <table class="table table-striped">
      <thead>
        <tr  @click="sortBy">
          <th id="id">Номер заказа</th>
          <th id="date">Дата создания</th>
          <th id="client">Клиент</th>
          <th id="">Комментарии</th>
          <th id="status">Статус заказа</th>
          <th id="sourceOrder">Источник</th>
          <th id="">Способ доставки</th>
          <th id="deliveryStatus">Статус доставки</th>
          <th id="">Сумма</th>
          <th>Опции</th>
        </tr>
      </thead>
      <tbody >
        <tr v-for="order in orderedOrder" :key="order.id">
          <td>{{order.id}}</td>
          <td class="small">{{dateFormat(order.createdAt)}}</td>
          <td class="client-name">
            <span>{{order.clientSurname}} {{order.clientName}} </span>
            <p>{{order.clientPhone}}</p>
            <small>{{order.clientEmail}}</small>
          </td>
          <td>{{order.comment}}</td>
          <td>{{order.status}}</td>
          <td class="small">{{order.sourceOrder}}</td>
          <td><small>{{order.delType}}</small></td>
          <td><small>{{order.deliveryStatus}}</small></td>
          <td>{{order.total}}</td>
          <td><button class="btn btn-primary" @click="$emit('editOrder', order.id)"><i class="far fa-edit"></i></button></td>
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
      :page-class="'page-item'">
    </paginate>
  </div>
</template>
<script>
import axios from 'axios'
import VueResource from 'vue-resource'
import moment from 'moment'

export default {
  name: 'orders',
  data () {
    return {
      orders: [],
      page: 1,
      currentPosition: 0,
      lastPosition: 10,
      sort: 'id',
      ordered: 'desc',
      orderArr: ['asc','desc'],
      filter: '',
    }
  },
  created () {
    this.getOrderList()
  }, 
  computed: {
    pageCount: function () {
      if (!this.filter) {
        return Math.ceil(this.orders.length/10)
      } else {
        return Math.ceil(_.filter(this.orders, (o)=>{return _.includes(o.number, this.filter)}).length/10)
      }  
    },
    orderedOrder: function () {
      if (!this.filter) {
        return _.slice(_.orderBy(this.orders, this.sort, this.ordered), this.currentPosition, this.lastPosition)
      }        
      else {
        return _.slice(_.orderBy(_.filter(this.orders, (o)=>{return _.includes(o.deliveryStatus, this.filter) || _.includes(o.clientName, this.filter) || _.includes(o.clientSurname, this.filter) || _.includes(o.clientPhone, this.filter) || _.includes(o.createdAt, this.filter) || _.includes(o.sourceOrder, this.filter) || _.includes(o.comment, this.filter) || _.includes(o.total, this.filter)}), this.sort, this.ordered), this.currentPosition, this.lastPosition)
      }  
    },
  },
  methods: {
    dateFormat (dateOrder) {
      return moment(dateOrder).format('YYYY-MM-DD HH:mm:ss');
    },
    getOrderList () {
      axios(`${this.$store.state.host}/orders`)
        .then((res)=>this.orders = res.data)
        .catch((err)=>console.log(err))
    },
    getPage(e) {
      this.currentPosition = (e-1)*10;
      this.lastPosition = this.currentPosition+10;
    },
    sortBy (e) {
      if(this.sort === e.target.id) {
        this.ordered = this.orderArr.filter(el=>el != this.ordered)
      } else {
        this.sort = e.target.id;
      }
    },
  }
}
</script>
<style>
  .client-name {
    width: 20%
  }
  .date-order {
    font-size: 0.8rem;
  }
</style>
