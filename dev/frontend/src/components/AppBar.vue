<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>Blue thingy</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu left bottom open-on-hover v-if="isConnected">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";
import Authentication from "@/api/Authentication";
import router from "@/router";

export default {
  name: "AppBar",
  computed: {
    ...mapGetters(["isConnected"]),
  },
  methods: {
    logout() {
      Authentication.logout()
        .then(() => {
          this.$store.commit("logoutUser");
          this.$cookies.remove("token");
          router.push("login");
        })
        .catch(error => console.error(error));
    }
  }
};
</script>

<style scoped></style>
