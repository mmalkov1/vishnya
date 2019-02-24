<template>
  <h1>Test</h1>
</template>
<script>
import axios from "axios";
import VueResource from "vue-resource";
import moment from "moment";

export default {
  name: "imOrders",
  data() {
    return {
      orders: []
    };
  },
  created() {
    //this.getImOrders();
  },
  methods: {
    getImOrders() {
      let option = {
        headers: {},
        auth: {
          username: "makoviysvetlana@gmail.com",
          password: "tiramicy"
        }
      };
      console.log("Start response...");
      let a = 0;
      axios
        .get(
          `https://vishnya.org.ua/wp-json/wc/v2/products?per_page=100&page=10`,
          option
        )
        .then(res => {
          res.data.map(el => {
            axios(`${this.$store.state.host}/products/${el.sku}`, {
              method: "PUT",
              data: {
                product_photo: el.images[0].src
              }
            })
              .then(rslt => {
                a++;
                console.log(`${a}. Product ${el.sku} was updated...`);
              })
              .catch(error => console.log(error));
          });
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
<style>
</style>
