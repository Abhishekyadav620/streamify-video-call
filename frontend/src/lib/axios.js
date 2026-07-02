import axios from "axios";

// Use a simpler configuration that explicitly sets the base URL
export const axiosInstance = axios.create({
  baseURL: "https://streamify-backend-9dkh.onrender.com",
  withCredentials: true, // send cookies with the request
});