import axios from "axios";

import router from "../router";

const baseURL = process.env.VUE_APP_API_BASE_URL;

// Enable cookies for axios requests
axios.defaults.withCredentials = true;

const httpClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Add an unauthorized interceptor.
 * In case a call to the api is unauthorized, push login to the router.
 *
 * @see https://stackoverflow.com/a/54745771/3771148
 */
httpClient.interceptors.response.use(
  response => response,
  responseError => {
    if (
      responseError.response.status === 401 &&
      router.currentRoute.name !== "Login"
    ) {
      // TODO feedback?
      router.push("login");
    }
    return Promise.reject(responseError);
  }
);

export default httpClient;
