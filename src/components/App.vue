<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark" v-if="state !=='auth'">
      <a class="navbar-brand" href="#">Вишня</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarsExampleDefault"
        aria-controls="navbarsExampleDefault"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link">Главная</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click="showProductsList">Товары</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click="showOrdersList">Заказы</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click="showPostingList">Приходы</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click="showSyncOrders">Магазин</a>
          </li>
        </ul>
      </div>
    </nav>
    <app-products
      v-if="state === 'products'"
      @editProduct="ShowEditProduct"
      @addProduct="addProduct"
    ></app-products>
    <app-edit-product
      v-else-if="state === 'edit-product'"
      :productId="editProductId"
      @editedProd="showProductsList"
      @editOrder="ShowEditOrder"
      @editPosting="showEditPosting"
    ></app-edit-product>
    <app-add-product v-else-if="state === 'add-product'" @addProduct="showProductsList"></app-add-product>
    <orders v-else-if="state === 'orders'" @addOrder="addOrder" @editOrder="ShowEditOrder"></orders>
    <add-order v-else-if="state === 'add-order'" @addOrder="showOrdersList"></add-order>
    <edit-order v-else-if="state === 'edit-order'" :orderId="editOrderId"></edit-order>
    <app-postings
      v-else-if="state === 'postings'"
      @addPosting="addPosting"
      @editPosting="showEditPosting"
    ></app-postings>
    <add-posting v-else-if="state === 'add-posting'" @addPosting="showPostingList"></add-posting>
    <edit-posting v-else-if="state === 'edit-posting'" :postingId="editPostingId"></edit-posting>
    <im-order v-else-if="state === 'im-orders'"></im-order>
    <auth v-else-if="state === 'auth'" @products="showProductsList"></auth>
    <div v-else>Такой страницы не существует</div>
  </div>
</template>
 
<script>
export default {
  data() {
    name: "app";
    return {
      editProductId: 0,
      editOrderId: 0,
      editPostingId: 0,
      state: "auth"
    };
  },
  methods: {
    ShowEditProduct: function(id) {
      this.state = "edit-product";
      this.editProductId = id;
    },
    showProductsList: function() {
      this.state = "products";
    },
    addProduct: function() {
      this.state = "add-product";
    },
    showOrdersList: function() {
      this.state = "orders";
    },
    addOrder: function() {
      this.state = "add-order";
    },
    ShowEditOrder: function(id) {
      this.state = "edit-order";
      this.editOrderId = id;
    },
    showPostingList: function() {
      this.state = "postings";
    },
    addPosting: function() {
      this.state = "add-posting";
    },
    showEditPosting: function(id) {
      this.state = "edit-posting";
      this.editPostingId = id;
    },
    showSyncOrders: function() {
      this.state = "im-orders";
    }
  }
};
</script>
<style>
.nav-item {
  cursor: pointer;
}
</style>

