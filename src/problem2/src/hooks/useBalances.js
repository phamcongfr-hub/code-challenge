import { useState, useEffect } from 'react';

// Initialize default balances for demo purposes
const DEFAULT_BALANCES = {
  'ETH': 5.5,
  'USDC': 10000,
  'USDT': 5000,
  'WBTC': 0.5,
  'BNB': 10,
  'MATIC': 1000,
  'AVAX': 50,
  'SOL': 25,
  'DOT': 100,
  'ATOM': 150,
  'LINK': 200,
  'UNI': 300,
  'AAVE': 20,
  'CRV': 500,
  'SUSHI': 400,
  'COMP': 15,
  'MKR': 2,
  'SNX': 100,
  'YFI': 0.1,
  'BAL': 50,
};

const STORAGE_KEY = 'swapflow_balances';

export function useBalances() {
  const [balances, setBalances] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored balances:', e);
        return DEFAULT_BALANCES;
      }
    }
    return DEFAULT_BALANCES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(balances));
  }, [balances]);

  const getBalance = (currency) => {
    return balances[currency] || 0;
  };

  const updateBalance = (currency, amount) => {
    setBalances(prev => ({
      ...prev,
      [currency]: Math.max(0, amount)
    }));
  };

  const executeSwap = (fromCurrency, fromAmount, toCurrency, toAmount) => {
    setBalances(prev => {
      const currentFromBalance = prev[fromCurrency] || 0;
      const currentToBalance = prev[toCurrency] || 0;

      return {
        ...prev,
        [fromCurrency]: Math.max(0, currentFromBalance - fromAmount),
        [toCurrency]: currentToBalance + toAmount
      };
    });
  };

  const resetBalances = () => {
    setBalances(DEFAULT_BALANCES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BALANCES));
  };

  const hasEnoughBalance = (currency, amount) => {
    const balance = getBalance(currency);
    return balance >= amount;
  };

  return {
    balances,
    setBalances,
    getBalance,
    updateBalance,
    executeSwap,
    resetBalances,
    hasEnoughBalance
  };
}
