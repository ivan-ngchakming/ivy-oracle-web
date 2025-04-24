import { getAddress } from "@ethersproject/address";
import { BASE_URL, CHAIN_ID } from "../constants";
import {
  mapDelegationStat,
  mapEthBlock,
  mapFTSODataProvider,
  mapRewardEpoch,
} from "../mappers";
import { FTSODataProviderBasic } from "../types";
import { APIDelegationStat } from "../types/api";
import { FTSODataProviderTowo } from "../types/external";

export const fetchFTSODataProviderAddresses = async (): Promise<string[]> => {
  return fetch(`${BASE_URL}/ftso/data-provider/addresses`).then((res) =>
    res.json()
  );
};

export const fetchFTSODataProviders = async (): Promise<
  FTSODataProviderBasic[]
> => {
  const [data, towoData, ivyData] = await Promise.all([
    fetch(`${BASE_URL}/ftso/data-provider`).then((res) => res.json()),
    fetchFTSODataProvidersTowo(),
    fetchFTSODataProvidersIvy(),
  ]);
  const providers = data.map((provider: any) => {
    const towoInfo = towoData.find(
      (p) => getAddress(p.address) === getAddress(provider.address)
    );
    const ivyInfo = ivyData.find(
      (p) => getAddress(p.address) === getAddress(provider.address)
    );

    return mapFTSODataProvider(provider, ivyInfo ?? towoInfo);
  });
  return providers;
};

export const fetchFTSODataProvidersTowo = async (): Promise<
  FTSODataProviderTowo[]
> => {
  const res = await fetch(
    `https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/bifrost-wallet.providerlist.json`
  );
  return await (
    await res.json()
  ).providers.filter((p: any) => p.chainId === CHAIN_ID);
};

export const fetchFTSODataProviderTowo = async (
  address: string
): Promise<FTSODataProviderTowo> => {
  return fetch(
    `https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/bifrost-wallet.providerlist.json`
  ).then(async (res) =>
    (await res.json()).providers.find(
      (p: any) => p.chainId === CHAIN_ID && p.address === address
    )
  );
};

export const fetchFTSODataProvidersIvy = async (): Promise<
  FTSODataProviderTowo[]
> => {
  const res = await fetch(
    `https://raw.githubusercontent.com/ivy-oracle/web/dev/public/.ftso-data-providers/index.json`
  );
  return await (await res.json()).filter((p: any) => p.chainId === CHAIN_ID);
};

export const fetchFTSODataProviderIvy = async (
  address: string
): Promise<FTSODataProviderTowo | null> => {
  const res = await fetch(
    `https://raw.githubusercontent.com/ivy-oracle/web/dev/public/.ftso-data-providers/index.json`
  );
  return await (
    await res.json()
  ).find((p: any) => p.chainId === CHAIN_ID && p.address === address);
};

export const fetchFTSODataProvider = async (
  address: string
): Promise<FTSODataProviderBasic> => {
  const [data, towoData, ivyData] = await Promise.all([
    fetch(`${BASE_URL}/ftso/data-provider/${address}`).then((res) =>
      res.json()
    ),
    fetchFTSODataProviderTowo(address),
    fetchFTSODataProviderIvy(address),
  ]);
  return mapFTSODataProvider(data, ivyData ?? towoData);
};

export const fetchDelegations = async ({
  from,
  to,
  page = 0,
  size = 100,
}: {
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}) => {
  if (from) {
    return fetch(
      `${BASE_URL}/delegation?from=${from}&page=${page}&size=${size}`
    ).then((res) => res.json());
  }
  if (to) {
    return fetch(
      `${BASE_URL}/delegation?to=${to}&page=${page}&size=${size}`
    ).then((res) => res.json());
  }
  return fetch(`${BASE_URL}/delegation?page=${page}&size=${size}`).then((res) =>
    res.json()
  );
};

export const fetchValidators = async () => {
  return await fetch(`${BASE_URL}/validator`).then((res) => res.json());
};

export const fetchDelegationStats = async () => {
  const [apiDelegationStats, apiTowoDataProviders] = await Promise.all([
    fetch(`${BASE_URL}/delegation/stats`).then((res) => res.json()),
    fetchFTSODataProvidersTowo(),
  ]);

  return apiDelegationStats.map((apiDelegationStat: APIDelegationStat) =>
    mapDelegationStat(
      apiDelegationStat,
      apiTowoDataProviders.find(
        (dp) => dp.address === apiDelegationStat.address
      )
    )
  );
};

export const fetchFundMovements = async (
  address: string,
  fromDate: string,
  toDate: string,
  levels: string
) => {
  const url = encodeURI(
    `${BASE_URL}/fund-trace?fromAddress=${address}&fromDate=${fromDate}&toDate=${toDate}&levels=${levels}`
  );
  const apiFundMovementNodes = await fetch(url).then((res) => res.json());

  return apiFundMovementNodes;
};

export const fetchRewardEpoch = async () => {
  const rewardEpochAPI = await fetch(`${BASE_URL}/ftso/reward-epoch`).then(
    (res) => res.json()
  );
  return mapRewardEpoch(rewardEpochAPI);
};
