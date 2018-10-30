import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    host: 'http://185.25.117.32:3012',
    //host: 'http://localhost:3012',
    npToken: 'd785ec75486a52d139578b925614e87a',
  }
})