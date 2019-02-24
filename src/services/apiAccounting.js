import axios from "axios";
import store from "../store/store";

axios.defaults.baseURL = `${store.state.host}`;

export const findCollection = async data => {
  const response = await axios.put("/products/findcollection", { data });

  return response;
};
