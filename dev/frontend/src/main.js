import Vue from "vue";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueApexCharts from "vue-apexcharts";
import { validate } from "vee-validate";

if (process.env.NODE_ENV === "production") {
  const {
    VUE_APP_FRONTEND_SENTRY_DSN,
    VUE_APP_ENABLE_SENTRY,
    VUE_APP_DEBUG_SENTRY
  } = process.env;
  Sentry.init({
    Vue,
    dsn: VUE_APP_FRONTEND_SENTRY_DSN,
    enabled: VUE_APP_ENABLE_SENTRY === "true" || VUE_APP_ENABLE_SENTRY === "1",
    debug: VUE_APP_DEBUG_SENTRY === "true" || VUE_APP_DEBUG_SENTRY === "1",
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],

    tracesSampleRate: 1.0
  });
}

Vue.config.productionTip = false;
Vue.use(VueApexCharts);
Vue.use(validate);

Vue.component("chart", VueApexCharts);

new Vue({
  router,
  store,
  vuetify,
  render: createElement => createElement(App)
}).$mount("#app");
