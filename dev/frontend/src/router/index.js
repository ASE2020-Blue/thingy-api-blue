import Vue from "vue";
import VueRouter from "vue-router";
import Thingies from "@/views/Thingies";
import Login from "@/views/Login";

Vue.use(VueRouter);

const routes = [
  {
    path: "/thingies",
    name: "Thingies",
    component: Thingies,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  // all other routes are redirected to the home page
  {
    path: "*",
    redirect: "/thingies",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
