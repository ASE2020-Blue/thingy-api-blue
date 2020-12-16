import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: ""
  },
  mutations: {
    initToken(state, payload) {
      state.token = payload;
    },
    loginUser(state, payload) {
      state.token = payload;
    },
    logoutUser(state) {
      state.token = "";
    }
  },
  getters: {
    isConnected: state => {
      return state.token !== "";
    }
  },
  actions: {},
  modules: {}
});
