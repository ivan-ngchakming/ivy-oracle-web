import axios from "axios";
import { SOLANA_API_URL } from "../constants";
import { mapValidators, mapValidator, mapTimeSeries} from "../mappers/validators";

export const fetchValidators = async () => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/`)).data;
  return mapValidators(data);
};

export const fetchValidator = async (identity: string) => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/${identity}`)).data;
  return mapValidator(data);
};

export const fetchValidatorRankHistory = async (identity: string) => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/${identity}/rank_history`)).data;
  return mapTimeSeries(data.rank_history);
};

export const fetchValidatorVoteDistance = async (identity: string) => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/${identity}/vote_distance`)).data;
  return mapTimeSeries(data.vote_distance);
};

export const fetchValidatorRootDistance = async (identity: string) => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/${identity}/root_distance`)).data;
  return mapTimeSeries(data.root_distance);
};
