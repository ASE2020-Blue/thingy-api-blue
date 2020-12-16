<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from "@/components/AppBar";
import router from "./router";

export default {
  name: "App",

  components: { AppBar },

  created() {
    if (this.$cookies.get("token")) {
      this.$store.commit("initToken", this.$cookies.get("token"));
      router.push("thingies");
    }
  }
};
</script>
