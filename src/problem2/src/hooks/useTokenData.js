import { useState, useEffect } from 'react';
import { fetchPrices } from '../utils/api';

export const useTokenData = () => {
  const [tokens, setTokens] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { tokens: fetchedTokens, prices: fetchedPrices } = await fetchPrices();
        setTokens(fetchedTokens);
        setPrices(fetchedPrices);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { tokens, prices, loading, error };
};
