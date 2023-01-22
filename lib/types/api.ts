import { Paginated } from "./common";

export interface APIProviderScheduledFeeChange {
  fee: number;
  validFromEpoch: number;
}

export interface APIProvider {
  address: string;
  whitelistedSymbols: string[];
  lockedVotePower: number;
  currentVotePower: number;
  lockedVotePowerPercentage: number;
  currentVotePowerPercentage: number;
  totalRewards: number;
  providerRewards: number;
  rewardRate: number;
  projectedRewardRate: number;
  averageRewardRate: number;
  accuracy: number;
  availability: number;
  fee: number;
  scheduledFeeChanges: APIProviderScheduledFeeChange[];
}

export interface APIEthBlock {
  blockHash: string;
  blockNumber: number;
  timestamp: string;
}

export interface APIDelegationStat {
  address: string;
  count: number;
  average: number;
  standardDeviation: number;
  percentageChange24Hour: number;
}

export interface APIFundMovementTransaction {
  transactionHash: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  timestamp: string;
  isContractInteraction: boolean;
}

export interface APIFundMovementNode {
  address: string;
  initiatedTransactions: APIFundMovementTransaction[];
  receivedTransactions: APIFundMovementTransaction[];
}

export interface RewardEpochAPI {
  epochId: number;
  votePowerLockBlockNumber: number;
  votePowerLockBlockDate: string;
  start: string;
  end: string;
}

export interface LoginAPI {
  message: string;
}

export interface BlockAPI {
  blockHash: string;
  blockNumber: number;
  timestamp: string;
}

export interface TransactionAPI {
  block: BlockAPI;
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

export interface AccountDetailAPI {
  address: string;
  delegationHistory: Paginated<any>;
  transactions: Paginated<TransactionAPI>;
}
