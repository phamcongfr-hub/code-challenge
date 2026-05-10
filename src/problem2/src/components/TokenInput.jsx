import { getTokenIcon, getTokenPlaceholder, formatNumber } from '../utils/helpers';

export default function TokenInput({ 
  label,
  value,
  onChange,
  selectedToken,
  onTokenSelect,
  usdValue,
  disabled,
  readOnly,
  prices,
  theme = 'dark'
}) {
  return (
    <div className={`rounded-2xl p-5 border overflow-hidden transition-colors ${
      theme === 'dark'
        ? 'bg-slate-800 border-slate-700'
        : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <label className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{label}</label>
      </div>

      {/* Input and Token Select */}
      <div className="flex items-center gap-3 overflow-hidden">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="0.0"
          disabled={disabled}
          readOnly={readOnly}
          className={`flex-1 bg-transparent text-3xl font-semibold placeholder-slate-600 focus:outline-none disabled:opacity-50 min-w-0 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        />
        
        <button
          type="button"
          onClick={onTokenSelect}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 border flex-shrink-0 min-w-[140px] ${
            theme === 'dark'
              ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 hover:border-purple-500'
              : 'bg-white hover:bg-gray-100 border-gray-300 hover:border-purple-500'
          }`}
        >
          {selectedToken ? (
            <>
              <img
                src={getTokenIcon(selectedToken.currency)}
                alt={selectedToken.currency}
                className="w-6 h-6 rounded-full flex-shrink-0"
                onError={(e) => {
                  e.target.src = getTokenPlaceholder(selectedToken.currency);
                }}
              />
              <div className="flex flex-col items-start">
                <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{selectedToken.currency}</span>
                <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>${formatNumber(prices[selectedToken.currency] || 0)}</span>
              </div>
            </>
          ) : (
            <span className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Select token</span>
          )}
          <svg className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* USD Value */}
      <div className={`mt-3 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
        ${usdValue}
      </div>
    </div>
  );
}


