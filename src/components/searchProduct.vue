<template>
  <div class="input-group col-12 mx-auto search-group">
    <input
      class="form-control py-2 border-right-0 border"
      type="search"
      placeholder="Поиск имя/артикул..."
      v-model="query"
      @keyup="keyUpSearch"
      @click="openMenu"
      v-show="showInput"
    >
    <ul class="search__list" v-show="isOpen">
      <li
        v-for="(item, index) in items"
        :key="index"
        @click="selectItem(index)"
        class="row search__item"
      >
        <div class="col-4">{{item.product_art}}</div>
        <div class="col-8">{{item.product_name}}</div>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
import VueResource from "vue-resource";
import moment from "moment";
import _ from "lodash";

export default {
  data() {
    return {
      items: [],
      query: "",
      isOpen: false,
      showInput: true
    };
  },
  methods: {
    openMenu() {
      this.isOpen = !this.isOpen;
    },
    keyUpSearch: _.debounce(function() {
      if (this.query !== "") {
        axios(
          `${this.$store.state.host}/products/find?search=${this.query}`
        ).then(res => (this.items = res.data));
      }
    }, 500),
    selectItem(index) {
      this.$emit("productSelect", this.items[index]);
      this.isOpen = false;
      this.showInput = false;
    }
  }
};
</script>
<style>
.search-group {
  padding: 0;
}
.search-group ul {
  position: absolute;
  top: 100%;
  list-style-type: none;
  background-color: white;
  border: 1px solid rgb(218, 218, 218);
}
.options {
  width: 10%;
}
.search__list {
  width: 200%;
  max-height: 25vh;
  overflow-y: scroll;
  padding-left: 0;
  z-index: 1;
}
.search__item {
  padding-bottom: 1rem;
  border-bottom: 1px solid rgb(218, 218, 218);
  margin: 0;
  cursor: pointer;
}
.search__item:hover {
  background-color: #28a745;
  color: white;
}
</style>
