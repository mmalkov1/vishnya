<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
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
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/" exact>Главная</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/products">Товары</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/orders">Заказы</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/postings">Приходы</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/market">Магазин</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
<script>
export default {};
</script>
<style>
.nav-item {
  cursor: pointer;
}
</style>
