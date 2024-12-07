import { ValidatorStat, ValidatorStats } from "../types";

export const mapValidatorStat = (data: any): ValidatorStat => {
  return {
    identity: data.identity,
    vote_account: data.vote_account,
    absolute_slot: data.absolute_slot,
    activated_stake: data.activated_stake,
    commission: data.commission,
    epoch_credits: data.epoch_credits,
    epoch_credits_rank: data.epoch_credits_rank,
    last_vote: data.last_vote,
    root_distance: data.root_distance,
    root_slot: data.root_slot,
    slot_index: data.slot_index,
    vote_distance: data.vote_distance
  };
};

export const mapValidatorStats = (data: any): ValidatorStats => {
  return {
    stats: data.map(mapValidatorStat),
  };
}
