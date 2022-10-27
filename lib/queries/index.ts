import { getAddress } from "@ethersproject/address";
import { BASE_URL, CHAIN_ID } from "../constants";
import { mapFTSODataProvider } from "../mappers";
import { FTSODataProviderBasic } from "../types";
import { FTSODataProviderTowo } from "../types/external";

export const fetchFTSODataProviderAddresses = async (): Promise<string[]> => {
  return fetch(`${BASE_URL}/ftso/data-provider/addresses`).then((res) =>
    res.json()
  );
};

export const fetchFTSODataProviders = async (): Promise<
  FTSODataProviderBasic[]
> => {
  const [data, towoData] = await Promise.all([
    fetch(`${BASE_URL}/ftso/data-provider`).then((res) => res.json()),
    fetchFTSODataProvidersTowo(),
  ]);
  const providers = data.map((provider: any) => {
    const towoInfo = towoData.find(
      (p) => getAddress(p.address) === getAddress(provider.address)
    );

    return mapFTSODataProvider(provider, towoInfo);
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

export const fetchFTSODataProvider = async (
  address: string
): Promise<FTSODataProviderBasic> => {
  const [data, towoData] = await Promise.all([
    fetch(`${BASE_URL}/ftso/data-provider/${address}`).then((res) =>
      res.json()
    ),
    fetchFTSODataProviderTowo(address),
  ]);
  return mapFTSODataProvider(data, towoData);
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
