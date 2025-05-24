import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.14:3000/api", // cambia por tu IP local real
});

export const getParqueaderos = async () => {
  const response = await api.get("/parqueaderos");
  console.log("Response data:", response.data); // Log the response data
  return response.data;
};
