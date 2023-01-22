import { Paginated } from "./common";

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
  currentVotePowerPercentage: number | null;
  lockedVotePowerPercentage: number | null;
  currentRewardRate: number | null;
  projectedRewardRate: number | null;
  averageRewardRate: number | null;
  currentReward: number | null;
  totalReward: number | null;

  availability: number | null;

  whitelistedSymbols: string[];

  website: string | null;
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

export interface EthBlock {
  blockHash: string;
  blockNumber: number;
  timestamp: string;
}

export interface DelegationStat {
  address: string;
  name: string;
  logoUrl: string;
  count: number;
  average: number;
  standardDeviation: number;
  percentageChange24Hour: number;
}

export interface FundMovementTransaction {
  transactionHash: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  timestamp: string;
  isContractInteraction: boolean;
}

export interface FundMovement extends Paginated<FundMovementTransaction> {
  amount: number;
}

export interface FundMovementNode {
  address: string;
  childNodesCount: number;
  hasMoreChildNodes: boolean;
  initiatedTransactions?: FundMovement;
  receivedTransactions: FundMovement;
}

export interface RewardEpoch {
  epochId: number;
  votePowerLockBlockNumber: number;
  votePowerLockBlockDate: Date;
  start: Date;
  end: Date;
}

export interface Login {
  message: string;
}

export interface Block {
  blockHash: string;
  blockNumber: number;
  timestamp: string;
}

export interface Transaction {
  block: Block;
  blockHash: string;
  blockNumber: number;
  fromAddress: string;
  gas: number;
  gasPrice: number;
  nonce: number;
  timestamp: string;
  toAddress: string;
  transactionHash: string;
  transactionIndex: number;
  value: number;
}

export interface DelegationEvent {
  from: string;
  to: string;
  priorVotePower: number;
  newVotePower: number;
  blockNumber: number;
  transactionIndex: number;
  transactionHash: string;
  logIndex: number;
  id: number;
}

export interface AccountDetail {
  address: string;
  delegationHistory: Paginated<DelegationEvent>;
  transactions: Paginated<Transaction>;
}

export * from "./common";
