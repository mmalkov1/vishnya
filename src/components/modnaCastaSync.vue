<template>
  <div>
    <h1>ModnaCasta!!!!!!!!</h1>
    <p>description</p>
  </div>
</template>

<script>
import { updateAllProducts } from "../services/apiCasta.js";
export default {
  name: "modnaCasta",
  data() {
    return {
      products: {
        items: [
          {
            code: "10160",
            brand: "Vishnya",
            color: "серебристый",
            size: "-",
            stock: 0
          }
        ]
      }
    };
  },
  mounted() {
    this.updateItems(this.products);
  },

  methods: {
    updateItems(data) {
      updateAllProducts(data)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped>
</style>