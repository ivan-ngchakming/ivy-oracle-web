import { useState, useEffect } from 'react';

interface TokenPriceConfig {
  coinGeckoId: string;
  refreshInterval?: number; // in milliseconds
}

export const useTokenPrice = ({ coinGeckoId, refreshInterval = 5 * 60 * 1000 }: TokenPriceConfig) => {
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`
        );
        const data = await response.json();
        setPrice(data[coinGeckoId].usd);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${coinGeckoId} price:`, err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, refreshInterval);
    return () => clearInterval(interval);
  }, [coinGeckoId, refreshInterval]);

  return { price, isLoading, error };
}; 