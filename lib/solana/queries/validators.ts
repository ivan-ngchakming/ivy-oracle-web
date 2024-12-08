import axios from "axios";
import { SOLANA_API_URL } from "../constants";
import { mapValidators, mapValidator } from "../mappers/validators";

export const fetchValidators = async () => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/`)).data;
  return mapValidators(data);
};

export const fetchValidator = async (identity: string) => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/${identity}`)).data;
  return mapValidator(data);
};
