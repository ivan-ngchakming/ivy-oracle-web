import axios from "axios";
import { SOLANA_API_URL } from "../constants";
import { mapValidators } from "../mappers/validators";

export const fetchValidators = async () => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/`)).data;
  return mapValidators(data);
};
