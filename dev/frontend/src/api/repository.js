import axios from "axios";

const baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const httpClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default httpClient;
