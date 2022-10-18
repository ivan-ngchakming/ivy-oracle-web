export enum Chain {
  Songbird = "songbird",
  Flare = "flare",
}

export const CHAIN = (process.env.NEXT_PUBLIC_CHAIN ?? "songbird") as Chain;

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
