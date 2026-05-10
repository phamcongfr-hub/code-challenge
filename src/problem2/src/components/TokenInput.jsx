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
  prices
}) {
  return (
    <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm text-slate-400 font-medium">{label}</label>
      </div>

      {/* Input and Token Select */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="0.0"
          disabled={disabled}
          readOnly={readOnly}
          className="flex-1 bg-transparent text-3xl font-semibold text-white placeholder-slate-600 focus:outline-none disabled:opacity-50"
        />
        
        <button
          type="button"
          onClick={onTokenSelect}
          className="flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all duration-200 border border-slate-600 hover:border-purple-500"
        >
          {selectedToken ? (
            <>
              <img
                src={getTokenIcon(selectedToken.currency)}
                alt={selectedToken.currency}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  e.target.src = getTokenPlaceholder(selectedToken.currency);
                }}
              />
              <span className="font-semibold text-white">{selectedToken.currency}</span>
            </>
          ) : (
            <span className="text-slate-400 font-medium">Select token</span>
          )}
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* USD Value */}
      <div className="mt-3 text-sm text-slate-400">
        ${usdValue}
      </div>
    </div>
  );
}
