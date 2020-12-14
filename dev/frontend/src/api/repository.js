import axios from "axios";

// TODO: change
const baseURL = "http://51.15.209.246"; // process.env.VUE_APP_API_BASE_URL;
// const baseURL = "http://localhost:8080"; // process.env.VUE_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const httpClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default httpClient;
