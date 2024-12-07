import axios from "axios";
import { SOLANA_API_URL } from "../constants";
import { mapValidatorStats } from "../mappers/validators";

export const fetchValidatorStats = async () => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/stats/`)).data;
  return mapValidatorStats(data);
};
