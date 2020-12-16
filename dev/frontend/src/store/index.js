import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: sessionStorage.getItem("token") || ""
  },
  mutations: {
    loginUser(state, payload) {
      state.token = payload;
      sessionStorage.setItem("token", payload);
    },
    logoutUser(state) {
      state.token = "";
      sessionStorage.setItem("token", "");
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
