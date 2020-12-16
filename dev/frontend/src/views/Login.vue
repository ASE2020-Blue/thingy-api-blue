<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-container>
            <validation-observer ref="observer" v-slot="{ invalid }">
              <form @submit.prevent="submit">
                <validation-provider
                  v-slot="{ errors }"
                  name="email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="email"
                    :error-messages="errors"
                    label="email"
                    required
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  rules="required|min:8|password"
                  name="password"
                >
                  <v-text-field
                    v-model="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    :error-messages="errors"
                    label="password"
                    required
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </validation-provider>
                <v-snackbar
                  top
                  :value="!!failed"
                  :timeout="3000"
                  color="warning"
                >
                  Login failed. Try again !
                </v-snackbar>
                <v-btn
                  class="mr-4"
                  type="submit"
                  :disabled="invalid"
                  color="success"
                >
                  submit
                </v-btn>
                <v-btn @click="clear">
                  clear
                </v-btn>
              </form>
            </validation-observer>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { required, alpha_dash, max, min } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from "vee-validate";

import Authentication from "../api/Authentication";
import router from "../router";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});

extend("alpha_dash", {
  ...alpha_dash,
  message:
    "{_field_} may contain alphabetic characters, numbers, dashes or underscores."
});

extend("email", {
  validate: email => {
    // https://vuejs.org/v2/cookbook/form-validation.html
    let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  },
  message: "{_field_} must be a valid email. Like robert@example.com"
});

extend("password", {
  validate: value => {
    let strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    return strongRegex.test(value);
  },
  message:
    "{_field_} must contain: uppercase and lowercase letter, number, special character"
});

extend("min", {
  ...min,
  message: "{_field_} has to be at least {length} characters long"
});

extend("max", {
  ...max,
  message: "{_field_} may not be longer than {length} characters"
});

export default {
  name: "Login",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      email: "demo@unifr.ch",
      password: "mC0mpl*xPass",
      showPassword: false,
      failed: false
    };
  },
  methods: {
    async submit() {
      this.failed = false;
      if (this.$refs.observer.validate()) {
        try {
          let bearerToken = await Authentication.login(
            this.email,
            this.password
          );
          this.$store.commit("loginUser", bearerToken.data);
          this.$cookies.set("token", bearerToken.data);

          // auth ok, redirect to thingies view
          router.push("thingies");
        } catch (e) {
          // user feedback with snackbar
          this.failed = true;
        }
      }
    },
    clear() {
      this.email = "";
      this.password = "";
      this.$refs.observer.reset();
    }
  }
};
</script>

<style scoped></style>
