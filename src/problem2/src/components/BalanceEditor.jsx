import { useState } from 'react';
import { getTokenIcon, getTokenPlaceholder, formatNumber } from '../utils/helpers';

export default function BalanceEditor({ tokens, prices, balances, onUpdate, onClose, theme = 'dark' }) {
  const [editedBalances, setEditedBalances] = useState({ ...balances });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = tokens.filter(token =>
    token.currency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBalanceChange = (currency, value) => {
    const numValue = parseFloat(value) || 0;
    setEditedBalances(prev => ({
      ...prev,
      [currency]: Math.max(0, numValue)
    }));
  };

  const handleSave = () => {
    onUpdate(editedBalances);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl border overflow-hidden flex flex-col animate-scale-in ${
          theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className={`p-6 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Configure Balances
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                : 'bg-gray-50 border-gray-300 text-slate-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
          {filteredTokens.map(token => (
            <div
              key={token.currency}
              className={`p-4 rounded-xl border transition-colors ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <img
                    src={getTokenIcon(token.currency)}
                    alt={token.currency}
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      e.target.src = getTokenPlaceholder(token.currency);
                    }}
                  />
                  <div>
                    <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {token.currency}
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      ${formatNumber(prices[token.currency] || 0, 2)}
                    </div>
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editedBalances[token.currency] || 0}
                  onChange={(e) => handleBalanceChange(token.currency, e.target.value)}
                  className={`px-4 py-2 rounded-lg border w-32 text-right ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={`p-6 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-slate-900'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
