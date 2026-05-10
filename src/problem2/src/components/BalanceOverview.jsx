import { useMemo } from 'react';
import { getTokenIcon, getTokenPlaceholder, formatNumber } from '../utils/helpers';

export default function BalanceOverview({ tokens, prices, balances, onClose, onReset, onEdit, theme = 'dark' }) {
  const tokensWithBalance = useMemo(() => {
    return tokens
      .filter(token => balances[token.currency] > 0)
      .map(token => ({
        ...token,
        balance: balances[token.currency] || 0,
        price: prices[token.currency] || 0,
        usdValue: (balances[token.currency] || 0) * (prices[token.currency] || 0)
      }))
      .sort((a, b) => b.usdValue - a.usdValue);
  }, [tokens, balances, prices]);

  const totalUsdValue = tokensWithBalance.reduce((sum, token) => sum + token.usdValue, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl border overflow-hidden flex flex-col animate-scale-in ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className={`p-6 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Wallet Balance
            </h2>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Total Value: <span className="font-semibold text-purple-500">${formatNumber(totalUsdValue, 2)}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              Edit
            </button>
            <button
              onClick={onReset}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-slate-900'
              }`}
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  : 'hover:bg-gray-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {tokensWithBalance.length === 0 ? (
            <div className="text-center py-12">
              <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                No tokens with balance
              </p>
            </div>
          ) : (
            tokensWithBalance.map(token => (
              <div
                key={token.currency}
                className={`p-4 rounded-xl border transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 hover:border-purple-500'
                    : 'bg-gray-50 border-gray-200 hover:border-purple-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                        ${formatNumber(token.price, 2)} per token
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {formatNumber(token.balance, 6)}
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      ${formatNumber(token.usdValue, 2)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
