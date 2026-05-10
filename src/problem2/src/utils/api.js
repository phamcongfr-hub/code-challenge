import { CONFIG } from './helpers';

export const fetchPrices = async () => {
  try {
    const response = await fetch(CONFIG.PRICES_API);
    if (!response.ok) throw new Error('Failed to fetch prices');
    
    const data = await response.json();
    
    const processedTokens = [];
    const prices = {};
    
    data.forEach(item => {
      if (item.price && item.price > 0) {
        const key = item.currency;
        
        if (!prices[key] || item.price > prices[key]) {
          prices[key] = item.price;
        }
        
        if (!processedTokens.find(t => t.currency === key)) {
          processedTokens.push({
            currency: key,
            date: item.date,
            price: item.price,
          });
        }
      }
    });
    
    return { 
      tokens: processedTokens.sort((a, b) => b.price - a.price),
      prices 
    };
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
};

export const simulateSwap = async (fromToken, toToken, amount) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        timestamp: new Date().toISOString(),
      });
    }, CONFIG.SWAP_DELAY);
  });
};
