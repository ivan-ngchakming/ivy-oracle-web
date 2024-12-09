export interface StakeChange {
  epoch: number;
  activated_stake: number;
  created_at: string;
}

export interface CommissionChange {
  epoch: number;
  commission: number;
  created_at: string;
}

export interface ValidatorStats {
  epoch_credits?: number | null;
  epoch_credits_rank?: number | null;
  last_vote?: number | null ;
  root_distance?: number | null;
  root_slot?: number | null;
  vote_distance?: number | null;
}

export interface Validator {
  id: number;
  identity: string;
  vote_pubkey: string;
  name?: string;
  description?: string | null;
  website?: string;
  logo_url?: string;
  commission: number;
  activated_stake: number;
  created_at: string;
  updated_at: string;
  info: Object;
  stake_changes: StakeChange[];
  comission_changes: CommissionChange[];
  vote_skip_rate: number;
  stats: ValidatorStats;
}

export interface TimeSeriesDataPoint {
  _time: string;
  _value: number;
}

export interface TimeSeries {
  series: TimeSeriesDataPoint[];
}
