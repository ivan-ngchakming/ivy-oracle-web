export enum Chain {
  Songbird = "songbird",
  Flare = "flare",
}

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://songbird-api.ivyoracle.xyz";

export const CHAIN = (process.env.NEXT_PUBLIC_CHAIN ?? "songbird") as Chain;

export const NATIVE_SYMBOL = {
  [Chain.Songbird]: "SGB",
  [Chain.Flare]: "FLR",
}[CHAIN];

export const FTSO_PROVIDER_ADDRESS = {
  [Chain.Songbird]: "0xA174D46EF49D7d4a0328f9910222689E9eAb2f45",
  [Chain.Flare]: "0x64D998BC81424131E5aF05071263fDeBD1a82986",
}[CHAIN];

export const RPC_ENDPOINT = {
  [Chain.Songbird]:
    process.env.NEXT_PUBLIC_SONGBIRD_RPC ??
    "https://songbird-api.flare.network/ext/bc/C/rpc",
  [Chain.Flare]:
    process.env.NEXT_PUBLIC_FLARE_RPC ??
    "https://flare-api.flare.network/ext/bc/C/rpc",
}[CHAIN];

export const CHAIN_ID = {
  [Chain.Songbird]: 19,
  [Chain.Flare]: 14,
}[CHAIN];

export const SYMBOLS = [
  "XRP",
  "LTC",
  "XLM",
  "DOGE",
  "ADA",
  "ALGO",
  "BCH",
  "DGB",
  "BTC",
  "ETH",
  "FIL",
  ...(CHAIN == Chain.Songbird ? ["SGB"] : []),
  ...(CHAIN == Chain.Flare ? ["FLR"] : []),
];

export const COLORS = [
  // "red",
  "blue",
  "orange",
  "yellow",
  "green",
  "slate",
  "black",
  "violet",
  "tan",
  "peru",
  "pink",
  "purple",
];
