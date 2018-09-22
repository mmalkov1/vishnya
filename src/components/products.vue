<template>

  <div id="table" class="container">
    <div class="row col-12 mt-3">
      <div class="form-group col-6 row">
        <label for="find" class="col-3" >Поиск</label>
        <input v-model="filter" class="form-control col-9" name="find">
      </div>
      <div class="form-group col-5  ml-auto row">
        <select v-model="priceType.count" class="custom-select col-6">
          <option v-for="type in priceTypes"
                  :key="type.id"
                  :value="type.id"
          >{{type.price_name}}</option>
        </select>
        <div class="col-5  ml-auto">
          <button  class="btn btn-success"  @click="$emit('addProduct')">Добавить</button>
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
      <tbody >
        <tr v-for="product in orderedProducts" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.product_art }}</td>
          <td>{{ product.product_name }}</td>
          <td>{{ categoryName(product.acc_category) }}</td>
          <td>{{ getProductQuantity (product.id)}}</td>
          <td>{{ priceCount(product.acc_product_prices)}}</td>
          <td>{{ product.product_descr }}</td>
          <td><button class="btn btn-primary" @click="$emit('editProduct', product.id)"><i class="far fa-edit"></i></button></td>
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
      :page-class="'page-item'">
    </paginate>
  </div>
  
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import 'babel-polyfill';

export default {
  name: 'app',
  data () {
    return {
      productData: [],
      priceType: {
        default: 1,
        count: 1
      },
      productCount: [],
      priceTypes: [],
      sort: 'id',
      ordered: 'asc',
      orderArr: ['asc','desc'],
      filter: '',
      page: 1,
      currentPosition: 0,
      lastPosition: 10,
    }
  },
  computed: {
    orderedProducts: function () {
      if (!this.filter) {
        return _.slice(_.orderBy(this.productData, this.sort, this.ordered), this.currentPosition, this.lastPosition)
      } else {
        return _.slice(_.orderBy(_.filter(this.productData, (o)=>{return _.includes(o.product_name, this.filter) || _.includes(o.product_art, this.filter) || o.id == this.filter}), this.sort, this.ordered), this.currentPosition, this.lastPosition)
      }
    },
    pageCount: function () {
      if (!this.filter) {
        return Math.ceil(this.productData.length/10);
      } else {
        return Math.ceil(_.filter(this.productData, (o)=>{return _.includes(o.product_name, this.filter)}).length/10)
      }
    },
    idArr: function () {
      let newArr1 = [];
      this.orderedProducts.reduce((acc, el)=>newArr1.push(el.id),[])
      return newArr1;
    }
  },
  created () {
    this.getAnswer();
    this.getPriceType ();
  },
  methods : {
    categoryName : function (cat) {
      if(cat != null) {
        return cat.category_name;
      }
    },
    sortBy (e) {
      if(this.sort === e.target.id) {
        this.ordered = this.orderArr.filter(el=>el != this.ordered)
        this.getProductCount ();
      } else {
        this.sort = e.target.id;
        this.getProductCount ();
      }
    },
    getPage(e) {
      this.currentPosition = (e-1)*10;
      this.lastPosition = this.currentPosition+10;
      this.getProductCount ();
    },
    getPriceType () {
      axios(`${this.$store.state.host}/productpricetype`)
        .then((response)=>this.priceTypes = response.data)
    },
    priceCount: function (prc) {
      if( prc.length != 0 && prc != null) {
        let PrcCount = prc.find((el)=>el.accPriceTypeId == this.priceType.count);
        if (PrcCount == undefined) {
            return 0;
        } else {
          return PrcCount.price_count; 
        }
      }
    },
    
    async getAnswer () {
      try {
        console.log(this.$root);
        let response = await axios.get(`${this.$store.state.host}/products`);
        this.totalProducts = response.data.length;
        this.productData = response.data;
        await this.getProductCount ()
      } catch (error) {
        console.log(error)
      }
    },
    getProductCount: function () {
      axios({
        method: 'PUT',
        url: `${this.$store.state.host}/orderproducts/productid/`,
        data: this.idArr
      })
      .then(res=>{
        this.productCount = res.data
      })
      .catch(err=>console.log(err))
    },
    getProductQuantity (id) {
      let res = this.productCount.filter(el=>el.product_id==id).reduce((acc, item)=>acc + item.product_count,0);
      if ( res === 0) { return null } else { return res };
    }
  }
}
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
