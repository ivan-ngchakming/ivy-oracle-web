import { SOLANA_LAMPORTS_PER_SOL } from "../lib/solana/constants";

export const formatSol = (amount: number) => {
  const sol = amount / SOLANA_LAMPORTS_PER_SOL;
  if (sol >= 1e9) return `${(sol / 1e9).toFixed(2)}B`;
  if (sol >= 1e6) return `${(sol / 1e6).toFixed(2)}M`;
  if (sol >= 1e3) return `${(sol / 1e3).toFixed(2)}K`;
  return sol.toFixed(2);
}