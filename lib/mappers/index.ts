import { Chain, CHAIN } from "../constants";
import { FTSODataProviderBasic } from "../types";
import { APIProvider } from "../types/api";
import {
  FTSODataProviderFlaremetrics,
  FTSODataProviderTowo,
} from "../types/external";

export const mapFTSODataProvider = (
  apiProvider: APIProvider,
  towoProvider?: FTSODataProviderTowo,
  flaremetricsProvider?: FTSODataProviderFlaremetrics
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
  flareMetricsLink:
    CHAIN === Chain.Songbird
      ? `https://flaremetrics.io/ftso/provider/${
          flaremetricsProvider?.data_provider.route_name ?? apiProvider.address
        }`
      : null,
  ftsoMonitorLink: `https://${CHAIN}-ftso-monitor.flare.network/price?currency=XRP&startTime=30m&providerAddress=${apiProvider.address.toLowerCase()}`,
  blockChainExplorerLink: `https://${CHAIN}-explorer.flare.network/address/${apiProvider.address}`,
});
