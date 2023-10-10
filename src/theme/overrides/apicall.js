import axios from "axios";
export const ApiCall = axios.create({
  // Set your desired configuration options here
  baseURL:process.env.REACT_APP_URL,
  headers: {
    // Set any default headers you need
    "Content-Type": "application/json",
    // Add any authentication headers if required
    Authorization: "Bearer ",
  },
});
