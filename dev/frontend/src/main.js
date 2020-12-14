import Vue from "vue";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueApexCharts from "vue-apexcharts";
import * as VeeValidate from "vee-validate";

if (process.env.NODE_ENV === "production") {
  const { FRONTEND_SENTRY_DSN, ENABLE_SENTRY, DEBUG_SENTRY } = process.env;
  Sentry.init({
    Vue,
    dsn: FRONTEND_SENTRY_DSN,
    enabled: ENABLE_SENTRY === "true" || ENABLE_SENTRY === "1",
    debug: DEBUG_SENTRY === "true" || DEBUG_SENTRY === "1",
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],

    tracesSampleRate: 1.0
  });
}

Vue.config.productionTip = false;
Vue.use(VueApexCharts);
Vue.use(VeeValidate);

Vue.component("chart", VueApexCharts);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
