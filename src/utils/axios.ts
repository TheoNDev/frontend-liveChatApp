import axios from "axios";

axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  baseURL: "https://backend-livechatapp-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
