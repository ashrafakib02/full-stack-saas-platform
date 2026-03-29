// src/api/test.js
import axios from "axios";

export const testApi = async () => {
  const res = await axios.get("http://localhost:5000/health");
  return res.data;
};