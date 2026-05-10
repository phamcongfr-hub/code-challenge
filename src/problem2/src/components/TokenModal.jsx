import { useState, useEffect } from 'react';
import { getTokenIcon, getTokenPlaceholder, formatNumber } from '../utils/helpers';

export default function TokenModal({ isOpen, onClose, tokens, prices, onSelect, title = "Select Token", theme = 'dark' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTokens, setFilteredTokens] = useState(tokens);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setFilteredTokens(tokens);
    }
  }, [isOpen, tokens]);

  useEffect(() => {
    const filtered = tokens.filter(token =>
      token.currency.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTokens(filtered);
  }, [searchQuery, tokens]);

  if (!isOpen) return null;

  const handleTokenClick = (token) => {
    onSelect(token);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative rounded-3xl w-full max-w-md mx-4 shadow-2xl border animate-scale-in ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-700'
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
          <button
            onClick={onClose}
            className={`transition-colors p-2 ${
              theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-6">
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className={`w-full border rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-gray-50 border-gray-300 text-slate-900'
            }`}
          />
        </div>

        {/* Token List */}
        <div className="max-h-[400px] overflow-y-auto px-4 pb-4">
          {filteredTokens.length === 0 ? (
            <div className={`text-center py-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              No tokens found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTokens.map((token) => (
                <button
                  key={token.currency}
                  onClick={() => handleTokenClick(token)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 border ${
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 border-transparent hover:border-purple-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-transparent hover:border-purple-500'
                  }`}
                >
                  <img
                    src={getTokenIcon(token.currency)}
                    alt={token.currency}
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      e.target.src = getTokenPlaceholder(token.currency);
                    }}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white">{token.currency}</div>
                    <div className="text-sm text-slate-400">
                      ${formatNumber(prices[token.currency] || 0)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

