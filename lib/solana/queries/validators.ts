import axios from "axios";
import { SOLANA_API_URL } from "../constants";
import { mapValidators, mapValidator, mapTimeSeries, mapVotes } from "../mappers/validators";

export const fetchValidators = async () => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/`)).data;
  return mapValidators(data);
};

export const fetchValidator = async (vote_pubkey: string) => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/${vote_pubkey}`)).data;
  return mapValidator(data);
};

export const fetchValidatorRankHistory = async (vote_pubkey: string) => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/${vote_pubkey}/rank_history`)).data;
  return mapTimeSeries(data.rank_history);
};

export const fetchValidatorVoteDistance = async (vote_pubkey: string) => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/${vote_pubkey}/vote_distance`)).data;
  return mapTimeSeries(data.vote_distance);
};

export const fetchValidatorRootDistance = async (vote_pubkey: string) => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/${vote_pubkey}/root_distance`)).data;
  return mapTimeSeries(data.root_distance);
};

export const fetchValidatorVotes = async (vote_pubkey: string) => {
  const data = (await axios.get(`${SOLANA_API_URL}/api/validators/${vote_pubkey}/votes`)).data;
  return mapVotes(data);
};
