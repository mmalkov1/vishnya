import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    host: "http://185.25.117.32:3012",
    //host: "http://localhost:3012",
    npToken: "d785ec75486a52d139578b925614e87a",
    modnaCastaToken: "i5ybmm8zlp9jdefu7k7j6420gutlrz6iemfynhfm",
    wc: {
      username: "makoviysvetlana@gmail.com",
      password: "tiramicy"
    },
    role: 1,
    isLoaded: false,
    userAuth: true,
    pageIsLoad: false
  },
  mutations: {
    setRoleUser(state, value) {
      state.role = +value;
    },
    setAuthUser(state, value) {
      state.userAuth = value;
    }
  }
});
