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

export interface Delegation {
  from: string;
  amount: number;
  updatedAt: number;
}

export interface ScheduledFeeChange {
  fee: number;
  validFromEpoch: number;
}

export interface ProviderBasic {
  address: string;
  name: string;
  logoUrl: string;

  accuracy: number | null;
  fee: number | null;
  scheduledFeeChange: ScheduledFeeChange[] | null;
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

export interface Provider extends ProviderBasic {
  selfDelegation: Delegation;
  delegations: Delegation[];
  delegationsCount: number;
  accuracyData: AccuracyDataPoint[];
}
