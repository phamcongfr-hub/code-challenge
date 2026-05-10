import { useState, useEffect } from 'react';
import SwapCard from './components/SwapCard';
import Toast from './components/Toast';
import { useTokenData } from './hooks/useTokenData';
import { useBalances } from './hooks/useBalances';
import BalanceOverview from './components/BalanceOverview';
import BalanceEditor from './components/BalanceEditor';
import HelpModal from './components/HelpModal';

function App() {
  const { tokens, prices, loading, error } = useTokenData();
  const balanceManager = useBalances();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [showBalanceOverview, setShowBalanceOverview] = useState(false);
  const [showBalanceEditor, setShowBalanceEditor] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-white text-xl">Loading tokens...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl mb-4">❌ Failed to load tokens</p>
          <p className="text-slate-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
        : 'bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100'
    }`}>
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 -left-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob ${
          theme === 'dark' ? 'bg-purple-500 opacity-20' : 'bg-purple-400 opacity-30'
        }`}></div>
        <div className={`absolute top-0 -right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 ${
          theme === 'dark' ? 'bg-pink-500 opacity-20' : 'bg-pink-400 opacity-30'
        }`}></div>
        <div className={`absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 ${
          theme === 'dark' ? 'bg-blue-500 opacity-20' : 'bg-blue-400 opacity-30'
        }`}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
        {/* Header */}
        <header className="w-full max-w-lg mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="url(#gradient)" strokeWidth="3"/>
                <path d="M12 16L15 19L20 13" stroke="url(#gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#667eea"/>
                    <stop offset="100%" stopColor="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
              <h1 className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>SwapFlow</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHelp(true)}
                className={`p-2 rounded-xl transition-colors border ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                    : 'bg-white hover:bg-gray-100 border-gray-300 text-slate-900'
                }`}
                title="How to use"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                onClick={() => setShowBalanceOverview(!showBalanceOverview)}
                className={`p-2 rounded-xl transition-colors border ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                    : 'bg-white hover:bg-gray-100 border-gray-300 text-slate-900'
                }`}
                title="View wallet"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-colors border ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                    : 'bg-white hover:bg-gray-100 border-gray-300 text-slate-900'
                }`}
                aria-label="Toggle theme"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={theme === 'dark' ? 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' : 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'} />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {showHelp && (
          <HelpModal onClose={() => setShowHelp(false)} theme={theme} />
        )}

        {showBalanceOverview && (
          <BalanceOverview
            tokens={tokens}
            prices={prices}
            balances={balanceManager.balances}
            onClose={() => setShowBalanceOverview(false)}
            onReset={() => {
              balanceManager.resetBalances();
              showToast('Balances reset to defaults', 'success');
            }}
            onEdit={() => {
              setShowBalanceOverview(false);
              setShowBalanceEditor(true);
            }}
            theme={theme}
          />
        )}

        {showBalanceEditor && (
          <BalanceEditor
            tokens={tokens}
            prices={prices}
            balances={balanceManager.balances}
            onUpdate={(newBalances) => {
              balanceManager.setBalances(newBalances);
              showToast('Balances updated successfully', 'success');
            }}
            onClose={() => setShowBalanceEditor(false)}
            theme={theme}
          />
        )}

        <div className="flex-1 flex items-center justify-center w-full">
          <SwapCard 
            tokens={tokens} 
            prices={prices} 
            onShowToast={showToast} 
            theme={theme}
            balanceManager={balanceManager}
          />
        </div>

        {/* Footer */}
        <footer className={`w-full max-w-lg mt-8 text-center text-sm ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <p>Built with Vite + React + Tailwind CSS</p>
        </footer>
      </div>

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={closeToast}
      />
    </div>
  );
}

export default App;
