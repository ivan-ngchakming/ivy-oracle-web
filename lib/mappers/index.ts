import { Chain, CHAIN } from "../constants";
import { FTSODataProviderBasic } from "../types";
import { APIProvider } from "../types/api";
import { FTSODataProviderTowo } from "../types/external";
import flareMetricsData from "../../assets/flaremetricLinks.json";

export const mapFTSODataProvider = (
  apiProvider: APIProvider,
  towoProvider?: FTSODataProviderTowo
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
      ? (flareMetricsData as any)[apiProvider.address] // TODO: link to Flaremetrics by URL when available
      : null,
  ftsoMonitorLink: `https://${CHAIN}-ftso-monitor.flare.network/price?currency=XRP&startTime=30m&providerAddress=${apiProvider.address.toLowerCase()}`,
  blockChainExplorerLink: `https://${CHAIN}-explorer.flare.network/address/${apiProvider.address}`,
});
