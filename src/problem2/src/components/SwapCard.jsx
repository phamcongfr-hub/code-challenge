import { useState, useEffect } from 'react';
import TokenInput from './TokenInput';
import TokenModal from './TokenModal';
import { validateDecimalInput, parseInputNumber, formatNumber } from '../utils/helpers';
import { simulateSwap } from '../utils/api';

export default function SwapCard({ tokens, prices, onShowToast }) {
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromUsdValue, setFromUsdValue] = useState('0.00');
  const [toUsdValue, setToUsdValue] = useState('0.00');
  const [exchangeRate, setExchangeRate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate output amount whenever inputs change
  useEffect(() => {
    if (!fromToken || !toToken || !fromAmount) {
      setToAmount('');
      setFromUsdValue('0.00');
      setToUsdValue('0.00');
      setExchangeRate('');
      setErrorMessage('');
      return;
    }

    const inputAmount = parseInputNumber(fromAmount);
    const fromPrice = prices[fromToken.currency];
    const toPrice = prices[toToken.currency];

    if (!fromPrice || !toPrice) {
      setErrorMessage('Price not available');
      setToAmount('');
      return;
    }

    setErrorMessage('');
    
    const outputAmount = (inputAmount * fromPrice) / toPrice;
    setToAmount(formatNumber(outputAmount, 6));

    // Update USD values
    setFromUsdValue(formatNumber(inputAmount * fromPrice));
    setToUsdValue(formatNumber(outputAmount * toPrice));

    // Exchange rate
    const rate = outputAmount / inputAmount;
    setExchangeRate(`1 ${fromToken.currency} = ${formatNumber(rate, 6)} ${toToken.currency}`);
  }, [fromAmount, fromToken, toToken, prices]);

  const handleFromAmountChange = (e) => {
    const value = e.target.value;
    if (validateDecimalInput(value) || value === '') {
      setFromAmount(value);
    }
  };

  const handleFlip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount('');
    setToAmount('');
  };

  const handleSwap = async (e) => {
    e.preventDefault();

    if (!fromToken || !toToken || !fromAmount || parseInputNumber(fromAmount) <= 0) {
      onShowToast('Please enter a valid amount', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const inputAmount = parseInputNumber(fromAmount);
      const outputAmount = parseInputNumber(toAmount);

      await simulateSwap(fromToken, toToken, inputAmount);

      onShowToast(
        `Successfully swapped ${formatNumber(inputAmount, 4)} ${fromToken.currency} for ${formatNumber(outputAmount, 4)} ${toToken.currency}`,
        'success'
      );

      // Reset form
      setFromAmount('');
      setToAmount('');
      setFromUsdValue('0.00');
      setToUsdValue('0.00');
      setExchangeRate('');
    } catch (error) {
      console.error('Swap error:', error);
      onShowToast('Swap failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const canSwap = fromToken && toToken && fromAmount && parseInputNumber(fromAmount) > 0 && fromToken.currency !== toToken.currency;

  const getButtonText = () => {
    if (isLoading) return 'Swapping...';
    if (!fromToken || !toToken) return 'Select a token';
    if (fromToken.currency === toToken.currency) return 'Select different tokens';
    if (!fromAmount || parseInputNumber(fromAmount) <= 0) return 'Enter an amount';
    return 'Swap';
  };

  return (
    <>
      <div className="w-full max-w-lg">
        <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-700">
          <form onSubmit={handleSwap} className="space-y-0">
            {/* From Token */}
            <TokenInput
              label="From"
              value={fromAmount}
              onChange={handleFromAmountChange}
              selectedToken={fromToken}
              onTokenSelect={() => setModalType('from')}
              usdValue={fromUsdValue}
              disabled={!fromToken}
              prices={prices}
            />

            {errorMessage && (
              <div className="mt-2 text-red-400 text-sm">{errorMessage}</div>
            )}

            {/* Flip Button */}
            <div className="flex justify-center -my-3 relative z-10">
              <button
                type="button"
                onClick={handleFlip}
                className="bg-slate-700 hover:bg-slate-600 p-3 rounded-xl border-4 border-slate-900 transition-all duration-200 hover:rotate-180"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* To Token */}
            <TokenInput
              label="To"
              value={toAmount}
              selectedToken={toToken}
              onTokenSelect={() => setModalType('to')}
              usdValue={toUsdValue}
              readOnly
              prices={prices}
            />

            {/* Exchange Info */}
            {exchangeRate && (
              <div className="mt-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Exchange Rate</span>
                  <span className="text-white font-medium">{exchangeRate}</span>
                </div>
              </div>
            )}

            {/* Swap Button */}
            <button
              type="submit"
              disabled={!canSwap || isLoading}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{getButtonText()}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Token Selection Modals */}
      <TokenModal
        isOpen={modalType === 'from'}
        onClose={() => setModalType(null)}
        tokens={tokens}
        prices={prices}
        onSelect={setFromToken}
        title="Select From Token"
      />

      <TokenModal
        isOpen={modalType === 'to'}
        onClose={() => setModalType(null)}
        tokens={tokens}
        prices={prices}
        onSelect={setToToken}
        title="Select To Token"
      />
    </>
  );
}
