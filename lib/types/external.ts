export interface FTSODataProviderTowo {
  chainId: number;
  name: string;
  description: string;
  url: string;
  address: string;
  logoURI: string;
}

export interface FTSODataProviderFlaremetricsInfo {
  local: string;
  country: string;
  established: string;
}

export interface FTSODataProviderFlaremetricsSocials {
  discord: string;
  twitter: string;
  youtube: string;
  telegram: string;
}

export interface FTSODataProviderFlaremetricsDataProvider {
  id: number;
  name: string;
  code: string;
  route_name: string;
  emblem: string;
  logo: string;
  description: string;
  extended_description: string;
  website_url: string;
  info: FTSODataProviderFlaremetricsInfo;
  socials: FTSODataProviderFlaremetricsSocials;
  verified: boolean;
  meta_image: string;
  feature_video: string;
  created_at: Date;
  updated_at: Date;
}

export interface StateChanges {
  votepower_change: number;
  reward_rate_change: number;
}

export interface RewardState {
  id: number;
  pool_id: number;
  reward_state: string;
  votepower: number;
  live_votepower: number;
  fee: number;
  reward_rate: number;
  reward_epoch: number;
  created_at: Date;
  updated_at: Date;
  state_changes: StateChanges;
}

export interface FTSODataProviderFlaremetrics {
  id: number;
  data_provider_id: number;
  name: string;
  description: string;
  address: string;
  network: string;
  votepower: string;
  average_reward_rate: string;
  fee: number;
  approved: number;
  rejected: number;
  created_at: Date;
  updated_at: Date;
  state_reward_rate: string;
  state_votepower: string;
  provider_name: string;
  "6h_availability": number;
  data_provider: FTSODataProviderFlaremetricsDataProvider;
  reward_state: RewardState;
  scheduled_fee_changes: any[];
}
