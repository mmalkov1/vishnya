<template>
  <div class="container">
    <h1>Список приходов</h1>
    <div class="row col-12 mt-3">
      <div class="form-group col-6 row">
        <label for="find" class="col-3" >Поиск</label>
        <input class="form-control col-9" name="find" v-model="filter">
      </div>
      <div class="form-group col-5  ml-auto row">
        <div class="col-5  ml-auto">
          <button  class="btn btn-success"  @click="$emit('addPosting')">Добавить</button>
        </div>
      </div>
    </div> 
    <table class="table table-striped">
      <thead>
        <tr  @click="sortBy">
          <th id="id">id</th>
          <th id="number">Номер прихода</th>
          <th id="date">Дата создания</th>
          <th id="provider">Поставщик</th>
          <th id="status">Статус</th>
          <th id="total">Сумма</th>
          <th>Опции</th>
        </tr>
      </thead>
      <tbody >
        <tr v-for="posting in orderedPosting" :key="posting.id">
          <td>{{posting.id}}</td>
          <td>{{posting.number}}</td>
          <td>{{posting.createdAt}}</td>
          <td>{{posting.provider}}</td>
          <td>{{posting.status}}</td>
          <td>{{posting.total}}</td>
          <td><button class="btn btn-primary" @click="$emit('editPosting', posting.id)"><i class="far fa-edit"></i></button></td>
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
  name: 'postings',
  data () {
    return {
      postings: [],
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
    this.getPostingList()
  }, 
  computed: {
    pageCount: function () {
      if (!this.filter) {
        return Math.ceil(this.postings.length/10)
      } else {
        return Math.ceil(_.filter(this.postings, (o)=>{return _.includes(o.number, this.filter)}).length/10)
      }
    },
    orderedPosting: function () {
      if (!this.filter) {
        return _.slice(_.orderBy(this.postings, this.sort, this.ordered), this.currentPosition, this.lastPosition)
      } else {
        return _.slice(_.orderBy(_.filter(this.postings, (o)=>{return o.number == this.filter || _.includes(o.provider, this.filter) || _.includes(o.status, this.filter)}), this.sort, this.ordered), this.currentPosition, this.lastPosition)
      }
      
    },
  },
  methods: {
    getPostingList () {
      axios(`${this.$store.state.host}/postings`)
        .then((res)=>this.postings = res.data)
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

</style>
