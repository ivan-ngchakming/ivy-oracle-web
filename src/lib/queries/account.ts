import axios from "axios";
import { BASE_URL } from "../constants";
import { mapAccountDetail } from "../mappers";

export const fetchAccountDetail = async (address: string) => {
  const data = (await axios.get(`${BASE_URL}/account/detail/${address}`)).data;
  return mapAccountDetail(data);
};
