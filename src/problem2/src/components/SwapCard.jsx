import { useState, useEffect } from "react";
import TokenInput from "./TokenInput";
import TokenModal from "./TokenModal";
import {
  validateDecimalInput,
  parseInputNumber,
  formatNumber,
} from "../utils/helpers";
import { simulateSwap } from "../utils/api";

export default function SwapCard({
  tokens,
  prices,
  onShowToast,
  theme = "dark",
  balanceManager,
}) {
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromUsdValue, setFromUsdValue] = useState("0.00");
  const [toUsdValue, setToUsdValue] = useState("0.00");
  const [exchangeRate, setExchangeRate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fromBalance = fromToken
    ? balanceManager.getBalance(fromToken.currency)
    : 0;
  const toBalance = toToken ? balanceManager.getBalance(toToken.currency) : 0;

  // Calculate output amount whenever inputs change
  useEffect(() => {
    if (!fromToken || !toToken || !fromAmount) {
      setToAmount("");
      setFromUsdValue("0.00");
      setToUsdValue("0.00");
      setExchangeRate("");
      return;
    }

    const inputAmount = parseInputNumber(fromAmount);
    const fromPrice = prices[fromToken.currency];
    const toPrice = prices[toToken.currency];

    if (!fromPrice || !toPrice) {
      setErrorMessage("Price not available");
      setToAmount("");
      return;
    }

    // Only clear error if balance is sufficient
    if (inputAmount <= fromBalance) {
      setErrorMessage("");
    }

    const outputAmount = (inputAmount * fromPrice) / toPrice;
    setToAmount(formatNumber(outputAmount, 6));

    // Update USD values
    setFromUsdValue(formatNumber(inputAmount * fromPrice));
    setToUsdValue(formatNumber(outputAmount * toPrice));

    // Exchange rate
    const rate = outputAmount / inputAmount;
    setExchangeRate(
      `1 ${fromToken.currency} = ${formatNumber(rate, 6)} ${toToken.currency}`,
    );
  }, [fromAmount, fromToken, toToken, prices, fromBalance]);

  const handleFromAmountChange = (e) => {
    const value = e.target.value;
    if (validateDecimalInput(value) || value === "") {
      setFromAmount(value);

      // Check if amount exceeds balance
      if (fromToken && value) {
        const inputAmount = parseInputNumber(value);
        if (inputAmount > fromBalance) {
          setErrorMessage(
            `Insufficient balance. Available: ${formatNumber(fromBalance, 6)} ${fromToken.currency}`,
          );
        } else {
          setErrorMessage("");
        }
      }
    }
  };

  const handleMaxAmount = () => {
    if (fromToken && fromBalance > 0) {
      setFromAmount(formatNumber(fromBalance, 6));
    }
  };

  const handleFlip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount("");
    setToAmount("");
    setErrorMessage("");
  };

  const handleSwap = async (e) => {
    e.preventDefault();

    if (
      !fromToken ||
      !toToken ||
      !fromAmount ||
      parseInputNumber(fromAmount) <= 0
    ) {
      onShowToast("Please enter a valid amount", "error");
      return;
    }

    const inputAmount = parseInputNumber(fromAmount);

    // Check if user has enough balance
    if (!balanceManager.hasEnoughBalance(fromToken.currency, inputAmount)) {
      onShowToast(`Insufficient ${fromToken.currency} balance`, "error");
      return;
    }

    setIsLoading(true);

    try {
      const outputAmount = parseInputNumber(toAmount);

      await simulateSwap(fromToken, toToken, inputAmount);

      // Update balances
      balanceManager.executeSwap(
        fromToken.currency,
        inputAmount,
        toToken.currency,
        outputAmount,
      );

      onShowToast(
        `Successfully swapped ${formatNumber(inputAmount, 4)} ${fromToken.currency} for ${formatNumber(outputAmount, 4)} ${toToken.currency}`,
        "success",
      );

      // Reset form
      setFromAmount("");
      setToAmount("");
      setFromUsdValue("0.00");
      setToUsdValue("0.00");
      setExchangeRate("");
      setErrorMessage("");
    } catch (error) {
      console.error("Swap error:", error);
      onShowToast("Swap failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const canSwap =
    fromToken &&
    toToken &&
    fromAmount &&
    parseInputNumber(fromAmount) > 0 &&
    fromToken.currency !== toToken.currency &&
    balanceManager.hasEnoughBalance(
      fromToken.currency,
      parseInputNumber(fromAmount),
    );

  const getButtonText = () => {
    if (isLoading) return "Swapping...";
    if (!fromToken || !toToken) return "Select a token";
    if (fromToken.currency === toToken.currency)
      return "Select different tokens";
    if (!fromAmount || parseInputNumber(fromAmount) <= 0)
      return "Enter an amount";
    if (
      fromToken &&
      fromAmount &&
      !balanceManager.hasEnoughBalance(
        fromToken.currency,
        parseInputNumber(fromAmount),
      )
    ) {
      return "Insufficient balance";
    }
    return "Swap";
  };

  return (
    <>
      <div className="w-full max-w-lg">
        <div
          className={`rounded-3xl p-6 shadow-2xl border transition-colors ${
            theme === "dark"
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <form onSubmit={handleSwap} className="space-y-0">
            {/* From Token */}
            <TokenInput
              label="From"
              value={fromAmount}
              onChange={handleFromAmountChange}
              selectedToken={fromToken}
              onTokenSelect={() => setModalType("from")}
              usdValue={fromUsdValue}
              disabled={!fromToken}
              prices={prices}
              theme={theme}
              balance={fromBalance}
              onMaxClick={handleMaxAmount}
            />

            {/* Error message with reserved space */}
            <div className="mt-1 min-h-[20px]">
              {errorMessage && (
                <div className="text-red-400 text-sm">{errorMessage}</div>
              )}
            </div>

            {/* Flip Button */}
            <div className="flex justify-center mb-5 mt-0 relative z-10">
              <button
                type="button"
                onClick={handleFlip}
                className={`p-3 rounded-xl border-4 transition-all duration-200 hover:rotate-180 ${
                  theme === "dark"
                    ? "bg-slate-700 hover:bg-slate-600 border-slate-900"
                    : "bg-gray-100 hover:bg-gray-200 border-white"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </button>
            </div>

            {/* To Token */}
            <TokenInput
              label="To"
              value={toAmount}
              selectedToken={toToken}
              onTokenSelect={() => setModalType("to")}
              usdValue={toUsdValue}
              readOnly
              prices={prices}
              theme={theme}
              balance={toBalance}
            />

            {/* Exchange Info */}
            <div
              className={`mt-4 p-4 rounded-xl border ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between text-sm">
                <span
                  className={
                    theme === "dark" ? "text-slate-400" : "text-slate-600"
                  }
                >
                  Exchange Rate
                </span>
                <span
                  className={`font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  {exchangeRate}
                </span>
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="submit"
              disabled={!canSwap || isLoading}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>{getButtonText()}</span>
            </button>
          </form>
        </div>
      </div>

      <TokenModal
        isOpen={modalType === "from"}
        onClose={() => setModalType(null)}
        tokens={tokens}
        prices={prices}
        balances={balanceManager.balances}
        isFromSelection={true}
        onSelect={setFromToken}
        title="Select From Token"
        theme={theme}
      />

      <TokenModal
        isOpen={modalType === "to"}
        onClose={() => setModalType(null)}
        tokens={tokens}
        prices={prices}
        balances={balanceManager.balances}
        isFromSelection={false}
        onSelect={setToToken}
        title="Select To Token"
        theme={theme}
      />
    </>
  );
}
