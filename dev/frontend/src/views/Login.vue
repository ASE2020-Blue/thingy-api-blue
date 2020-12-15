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
                  name="Username"
                  rules="required|max:10|min:4|alpha_dash"
                >
                  <v-text-field
                    v-model="username"
                    :error-messages="errors"
                    :counter="10"
                    label="Username"
                    required
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Password"
                  rules="required|min:8|password"
                >
                  <v-text-field
                    v-model="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    :error-messages="errors"
                    label="Password"
                    required
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </validation-provider>
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
      username: "",
      password: "",
      showPassword: false
    };
  },
  methods: {
    submit() {
      this.$refs.observer.validate();
    },
    clear() {
      this.username = "";
      this.password = "";
      this.$refs.observer.reset();
    }
  }
};
</script>

<style scoped></style>
