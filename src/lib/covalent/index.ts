import axios from "axios";

const covalentBaseUrl = `https://api.covalenthq.com/v1`;

export const covalentInstance = axios.create({
  baseURL: covalentBaseUrl,
  headers: {
    "Content-Type": "application/json"
  },
});



