import { FTSODataProviderBasic } from "../types";
import { APIProvider } from "../types/api";
import { FTSODataProviderTowo } from "../types/external";

export const mapFTSODataProvider = (
  apiProvider: APIProvider,
  towoProvider: FTSODataProviderTowo
): FTSODataProviderBasic => ({
  address: apiProvider.address,
  name: towoProvider?.name ?? apiProvider.address,
  logoUrl: towoProvider
    ? towoProvider.logoURI
    : "https://cdn.flaremetrics.io/flare/ftso/emblem/unknown@64.png",
  accuracy: apiProvider.accuracy,
  fee: apiProvider.fee,
  scheduledFeeChange: apiProvider.scheduledFeeChanges,
  currentVotePower: apiProvider.currentVotePower,
  lockedVotePower: apiProvider.lockedVotePower,
  currentRewardRate: apiProvider.rewardRate,
  averageRewardRate: null,
  currentReward: apiProvider.providerRewards,
  totalReward: apiProvider.totalRewards,
  availability: apiProvider.availability,
  whitelistedSymbols: apiProvider.whitelistedSymbols,
  flareMetricsLink: null,
  ftsoMonitorLink: `https://songbird-ftso-monitor.flare.network/price?currency=XRP&startTime=30m&providerAddress=${apiProvider.address.toLowerCase()}`,
  blockChainExplorerLink: `https://songbird-explorer.flare.network/address/${apiProvider.address}`,
});
