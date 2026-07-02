import axios from "axios";

// Use a simpler configuration that explicitly sets the base URL
export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // send cookies with the request
});