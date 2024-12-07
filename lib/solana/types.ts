export type ValidatorStat = {
  identity: string;
  vote_account: string;
  absolute_slot: number;
  activated_stake: number;
  commission: number;
  epoch_credits: number;
  epoch_credits_rank: number;
  last_vote: number;
  root_distance: number;
  root_slot: number;
  slot_index: number;
  vote_distance: number;
};

export type ValidatorStats = {
  stats: ValidatorStat[];
};
