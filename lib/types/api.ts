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
