import { BigNumber } from "ethers";

export function minimalTokenToToken(amount: number): number {
  return amount / 10 ** 18;
}

export function minimalTokenToTokenBigNumber(amount: BigNumber): BigNumber {
  return amount.div(BigNumber.from(10).pow(18));
}
