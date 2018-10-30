<template>
  <h1>Test</h1>
</template>
<script>
import axios from 'axios'
import VueResource from 'vue-resource'
import moment from 'moment'

export default {
  name: 'imOrders',
  data () {
    return {
      orders: []
    }
  },
  created () {
    this.getImOrders();
  },
  methods : {
    getImOrders () {
      let option = {
        headers : {
          'Authorization':'Bearer 287a0d6efcece7188675832cc20e57172743b28a'
        }
      }
      axios.get(`https://my.prom.ua/api/v1/orders/list?limit=100`, option)
        .then(res=>console.log(res))
        .catch(err=>console.log(err))
    }
  }
}
</script>
<style>

</style>
