import { BigNumber } from "bignumber.js";

export function minimalTokenToTokenBigNumber(amount: BigNumber): BigNumber {
  return amount.div(new BigNumber(10).pow(18));
}

export function minimalTokenToToken(amount: number): number {
  const amountBN = new BigNumber(amount);
  return minimalTokenToTokenBigNumber(amountBN).toNumber();
}
