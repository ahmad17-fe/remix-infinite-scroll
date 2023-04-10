import axios from "axios";

const BASE_URL = process.env.APP_HOST;

const client = axios.create({
  baseURL: BASE_URL,
});

export default client;
