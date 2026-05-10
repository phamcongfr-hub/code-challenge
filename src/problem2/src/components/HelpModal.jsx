export default function HelpModal({ onClose, theme = 'dark' }) {
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
            How to Use SwapFlow
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

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              🔄 Token Swapping
            </h3>
            <ul className={`space-y-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <li>• Select source token (tokens with balance appear first)</li>
              <li>• Select destination token</li>
              <li>• Enter amount or click MAX to use full balance</li>
              <li>• Review exchange rate and estimated output</li>
              <li>• Click Swap to execute the transaction</li>
            </ul>
          </section>

          <section>
            <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              💰 Wallet Management
            </h3>
            <ul className={`space-y-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <li>• Click Wallet button to view all your token balances</li>
              <li>• See total portfolio value in USD</li>
              <li>• Click Edit to configure custom balances for testing</li>
              <li>• Click Reset to restore default balances</li>
            </ul>
          </section>

          <section>
            <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              ⚡ Quick Actions
            </h3>
            <ul className={`space-y-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <li>• <span className="font-semibold">MAX Button:</span> Fills input with your entire balance</li>
              <li>• <span className="font-semibold">Flip Button:</span> Swaps source and destination tokens</li>
              <li>• <span className="font-semibold">Theme Toggle:</span> Switch between dark and light modes</li>
            </ul>
          </section>

          <section>
            <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              📊 Features
            </h3>
            <ul className={`space-y-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <li>• <span className="font-semibold">Real-time Rates:</span> Live exchange rate calculations</li>
              <li>• <span className="font-semibold">USD Values:</span> See fiat equivalent for all amounts</li>
              <li>• <span className="font-semibold">Balance Validation:</span> Prevents swapping more than you have</li>
              <li>• <span className="font-semibold">Persistent Storage:</span> Balances saved across sessions</li>
            </ul>
          </section>

          <section>
            <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              ⚠️ Important Notes
            </h3>
            <ul className={`space-y-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <li>• You can only select tokens with available balance as source</li>
              <li>• Insufficient balance will prevent swap execution</li>
              <li>• Exchange rates are fetched from live price data</li>
              <li>• This is a simulation - no real transactions occur</li>
            </ul>
          </section>
        </div>

        <div className={`p-6 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
