import axios from "axios";

const etherscanBaseUrl = `https://api.etherscan.io/api?module=account&apikey=${process.env.REACT_APP_ETHERSCAN_KEY}&`;

export const etherscanInstance = axios.create({
  baseURL: etherscanBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: process.env.REACT_APP_ETHERSCAN_KEY || "",
  },
});
