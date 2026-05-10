export const CONFIG = {
  PRICES_API: 'https://interview.switcheo.com/prices.json',
  TOKEN_ICONS_BASE: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/',
  SWAP_DELAY: 2000,
};

export const formatNumber = (num, decimals = 2) => {
  if (!num || isNaN(num)) return '0.00';
  return parseFloat(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatCompactNumber = (num) => {
  if (!num || isNaN(num)) return '0';
  if (num < 1000) return formatNumber(num, 4);
  if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
  return (num / 1000000).toFixed(2) + 'M';
};

export const validateDecimalInput = (value) => {
  const regex = /^[0-9]*[.,]?[0-9]*$/;
  return regex.test(value);
};

export const parseInputNumber = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(',', '.')) || 0;
};

export const getTokenIcon = (currency) => {
  return `${CONFIG.TOKEN_ICONS_BASE}${currency}.svg`;
};

export const getTokenPlaceholder = (currency) => {
  const firstLetter = currency ? currency.charAt(0).toUpperCase() : '?';
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="36" height="36" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="18" fill="url(#grad)"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${firstLetter}</text>
    </svg>
  `)}`;
};
