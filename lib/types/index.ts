interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

type HandlerFunction = (args: string[]) => void;

export type Ethereum = {
  request<T>(arg: RequestArguments): Promise<T>;
  on(chainId: string, handler: HandlerFunction): void;
  off(chainId: string, handler: HandlerFunction): void;
  isConnected(): boolean;
};

export type Paginated<T> = {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export interface Delegation {
  fromAddress: string;
  toAddress: string;
  amount: number;
  updatedAtBlock: number;
  createdAtBlock: number;
}

export interface FTSODataProviderScheduledFeeChange {
  fee: number;
  validFromEpoch: number;
}

export interface FTSODataProviderBasic {
  address: string;
  name: string;
  logoUrl: string;

  accuracy: number | null;
  fee: number | null;
  scheduledFeeChange: FTSODataProviderScheduledFeeChange[] | null;
  currentVotePower: number | null;
  lockedVotePower: number | null;
  currentRewardRate: number | null;
  averageRewardRate: number | null;
  currentReward: number | null;
  totalReward: number | null;

  availability: number | null;

  whitelistedSymbols: string[];

  flareMetricsLink: string | null;
  ftsoMonitorLink: string | null;
  blockChainExplorerLink: string | null;
}

export interface AccuracyDataPoint {
  epochID: number;
  symbol: string;
  result: number;
}

export interface FTSODataProvider extends FTSODataProviderBasic {
  selfDelegation: Delegation;
  delegations: Delegation[];
  delegationsCount: number;
  accuracyData: AccuracyDataPoint[];
}

export interface Validator {
  nodeID: string;
  rewardOwner: {
    addresses: string[];
    checksumAddresses: string[];
  };
  stakeAmount: number;
  potentialReward: number;
  delegationFee: number;
  uptime: number;
  connected: boolean;
}
