import { Validator, ValidatorStats } from "../types";

export const mapValidatorStats = (data: any): ValidatorStats => {
  if (!data) return {};

  return {
    epoch_credits: data.epoch_credits ? Number(data.epoch_credits) : null,
    epoch_credits_rank: data.epoch_credits_rank ? Number(data.epoch_credits_rank) : null,
  };
}

export const mapValidator = (data: any): Validator => {
  return {
    id: data.id,
    identity: data.identity,
    vote_pubkey: data.vote_pubkey,
    name: data.name,
    description: data.description,
    website: data.website,
    logo_url: data.logo_url,
    info: data.info || {},
    commission: data.commission,
    activated_stake: data.activated_stake,
    created_at: data.created_at,
    updated_at: data.updated_at,
    stake_changes: data.stake_changes || [],
    comission_changes: data.comission_changes || [],
    vote_skip_rate: data.vote_skip_rate || null,
    stats: mapValidatorStats(data.stats),
  };
};

export const mapValidators = (data: any): Validator[] => {
  return data.map((validator: any) => mapValidator(validator));
}
