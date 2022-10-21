import { BASE_URL, CHAIN_ID } from "../constants";
import { mapFTSODataProvider } from "../mappers";
import { FTSODataProviderBasic } from "../types";

export const fetchFTSODataProviders = async (): Promise<
  FTSODataProviderBasic[]
> => {
  const [data, towoData] = await Promise.all([
    fetch(`${BASE_URL}/ftso/data-provider`).then((res) => res.json()),
    fetch(
      `https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/bifrost-wallet.providerlist.json`
    ).then(async (res) =>
      (await res.json()).providers.filter((p: any) => p.chainId === CHAIN_ID)
    ),
  ]);
  const providers = data.map((provider: any) => {
    const towoInfo = towoData.find((p: any) => p.address === provider.address);

    return mapFTSODataProvider(provider, towoInfo);
  });
  return providers;
};
