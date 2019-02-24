import axios from "axios";
import store from "../store/store";

axios.defaults.baseURL = `${store.state.host}`;
axios.defaults.headers.common["Authorization"] = store.state.modnaCastaToken;

export const updateAllProducts = async data => {
  const response = await axios.post("/casta", { data });

  return response;
};
