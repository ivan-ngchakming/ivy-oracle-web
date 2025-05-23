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

export interface Vote {
  slot: number;
  latency: number;
}

export interface VotesData {
  node_pubkey: string;
  vote_pubkey: string;
  authorized_withdrawer: string;
  votes: Vote[];
}

export interface TimeSeriesDataPoint {
  _time: string;
  _value: number;
}

export interface TimeSeries {
  series: TimeSeriesDataPoint[];
}

export interface LeaderSchedule {
  slot: number;
  absolute_slot: number;
  status: 'CONFIRMED' | 'MISSED' | 'PENDING';
  validator_identity?: string;
}


export interface LeaderScheduleValidatorInfo {
  identity: string;
  vote_pubkey: string;
  previous_epoch_stake: number;
}


export interface FullLeaderSchedule {
  leader_schedule: LeaderSchedule[];
  validators: { [key: string]: LeaderScheduleValidatorInfo };
}
