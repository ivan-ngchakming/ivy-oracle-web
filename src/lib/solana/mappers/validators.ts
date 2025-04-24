import { TimeSeries, Validator, ValidatorStats, VotesData, LeaderSchedule, FullLeaderSchedule } from "../types";

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

export const mapTimeSeries = (data: any): TimeSeries => {
  return {
    series: data.map((series: any) => ({
      _time: series._time,
      _value: series._value,
    })),
  };
}

export const mapVotes = (data: any): VotesData => {
  return {
    node_pubkey: data.node_pubkey,
    vote_pubkey: data.vote_pubkey,
    authorized_withdrawer: data.authorized_withdrawer,
    votes: data.votes.map((vote: any) => ({
      slot: vote.slot,
      latency: vote.latency
    }))
  };
}

export const mapValidatorLeaderSchedule = (data: any): LeaderSchedule[] => {
  if (!data) return [];

  return Object.values(data).map((schedule: any) => ({
    slot: schedule.slot,
    absolute_slot: schedule.absolute_slot,
    status: schedule.status,
    validator_identity: schedule.validator_identity,
  }));
}

export const mapLeaderSchedule = (data: any): FullLeaderSchedule => {
  return {
    leader_schedule: mapValidatorLeaderSchedule(data.leader_schedule),
    validators: data.validators
  };
}
