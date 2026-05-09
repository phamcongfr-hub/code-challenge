// ===== Configuration =====
const CONFIG = {
  PRICES_API: 'https://interview.switcheo.com/prices.json',
  TOKEN_ICONS_BASE: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/',
  SWAP_DELAY: 2000, // Simulate network delay
};

// ===== State Management =====
const state = {
  tokens: [],
  prices: {},
  selectedFromToken: null,
  selectedToToken: null,
  isLoading: false,
  currentModalTarget: null,
  theme: localStorage.getItem('theme') || 'light',
};

// ===== Utility Functions =====
const utils = {
  // Format number with commas
  formatNumber(num, decimals = 2) {
    if (!num || isNaN(num)) return '0.00';
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  // Format large numbers (1000 -> 1K, 1000000 -> 1M)
  formatCompactNumber(num) {
    if (!num || isNaN(num)) return '0';
    if (num < 1000) return this.formatNumber(num, 4);
    if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
    return (num / 1000000).toFixed(2) + 'M';
  },

  // Validate decimal input
  validateDecimalInput(value) {
    const regex = /^[0-9]*[.,]?[0-9]*$/;
    return regex.test(value);
  },

  // Parse number from input (handles both . and ,)
  parseInputNumber(value) {
    if (!value) return 0;
    return parseFloat(value.replace(',', '.')) || 0;
  },

  // Get token icon URL
  getTokenIcon(currency) {
    return `${CONFIG.TOKEN_ICONS_BASE}${currency}.svg`;
  },

  // Get placeholder image (SVG data URL)
  getTokenPlaceholder(currency) {
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
  },
};

// ===== API Functions =====
const api = {
  async fetchPrices() {
    try {
      const response = await fetch(CONFIG.PRICES_API);
      if (!response.ok) throw new Error('Failed to fetch prices');
      
      const data = await response.json();
      
      // Process and organize data
      const processedTokens = [];
      const prices = {};
      
      data.forEach(item => {
        if (item.price && item.price > 0) {
          const key = item.currency;
          
          // Store the latest/highest price for each currency
          if (!prices[key] || item.price > prices[key]) {
            prices[key] = item.price;
          }
          
          // Add to tokens list if not already present
          if (!processedTokens.find(t => t.currency === key)) {
            processedTokens.push({
              currency: key,
              date: item.date,
              price: item.price,
            });
          }
        }
      });
      
      return { tokens: processedTokens, prices };
    } catch (error) {
      console.error('Error fetching prices:', error);
      throw error;
    }
  },

  async simulateSwap(fromToken, toToken, amount) {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          timestamp: new Date().toISOString(),
        });
      }, CONFIG.SWAP_DELAY);
    });
  },
};

// ===== UI Functions =====
const ui = {
  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const messageEl = toast.querySelector('.toast-message');
    
    messageEl.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  },

  showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  },

  hideError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.classList.remove('visible');
    }
  },

  updateTokenDisplay(target, token) {
    const infoEl = document.getElementById(`${target}TokenInfo`);
    if (!token) {
      infoEl.innerHTML = '<span class="token-placeholder">Select token</span>';
      return;
    }
    
    const iconUrl = utils.getTokenIcon(token.currency);
    const placeholder = utils.getTokenPlaceholder(token.currency);
    const price = state.prices[token.currency] || 0;
    
    infoEl.innerHTML = `
      <img src="${iconUrl}" 
           alt="${token.currency}" 
           class="token-icon"
           onerror="this.src='${placeholder}'">
      <div class="token-details">
        <span class="token-symbol">${token.currency}</span>
        <span class="token-price">$${utils.formatNumber(price)}</span>
      </div>
    `;
  },

  updateUsdValue(target, amount, token) {
    const usdEl = document.getElementById(`${target}UsdValue`);
    if (!amount || !token || !state.prices[token.currency]) {
      usdEl.textContent = '$0.00';
      return;
    }
    
    const usdValue = amount * state.prices[token.currency];
    usdEl.textContent = `$${utils.formatNumber(usdValue)}`;
  },

  updateExchangeInfo() {
    const infoEl = document.getElementById('exchangeInfo');
    const fromToken = state.selectedFromToken;
    const toToken = state.selectedToToken;
    const inputAmount = utils.parseInputNumber(document.getElementById('input-amount').value);
    const outputAmount = utils.parseInputNumber(document.getElementById('output-amount').value);
    
    if (!fromToken || !toToken || !inputAmount || !outputAmount) {
      infoEl.style.display = 'none';
      return;
    }
    
    infoEl.style.display = 'block';
    
    // Exchange rate
    const rate = outputAmount / inputAmount;
    document.getElementById('exchangeRate').textContent = 
      `1 ${fromToken.currency} = ${utils.formatNumber(rate, 6)} ${toToken.currency}`;
  },

  updateSwapButton() {
    const btn = document.getElementById('swapBtn');
    const btnText = btn.querySelector('.btn-text');
    const fromToken = state.selectedFromToken;
    const toToken = state.selectedToToken;
    const inputAmount = utils.parseInputNumber(document.getElementById('input-amount').value);
    
    // Check conditions
    if (!fromToken || !toToken) {
      btn.disabled = true;
      btnText.textContent = 'Select a token';
      return;
    }
    
    if (fromToken.currency === toToken.currency) {
      btn.disabled = true;
      btnText.textContent = 'Select different tokens';
      return;
    }
    
    if (!inputAmount || inputAmount <= 0) {
      btn.disabled = true;
      btnText.textContent = 'Enter an amount';
      return;
    }
    
    // All good
    btn.disabled = false;
    btnText.textContent = 'Swap';
  },

  renderTokenList(tokens, searchQuery = '') {
    const listEl = document.getElementById('tokenList');
    
    // Filter tokens based on search
    const filtered = tokens.filter(token => {
      const query = searchQuery.toLowerCase();
      return token.currency.toLowerCase().includes(query);
    });
    
    if (filtered.length === 0) {
      listEl.innerHTML = '<div class="no-results">No tokens found</div>';
      return;
    }
    
    listEl.innerHTML = filtered.map(token => {
      const iconUrl = utils.getTokenIcon(token.currency);
      const placeholder = utils.getTokenPlaceholder(token.currency);
      
      return `
        <div class="token-item" data-currency="${token.currency}">
          <img src="${iconUrl}" 
               alt="${token.currency}" 
               class="token-item-icon"
               onerror="this.src='${placeholder}'">
          <div class="token-item-info">
            <span class="token-item-name">${token.currency}</span>
            <span class="token-item-symbol">$${utils.formatNumber(state.prices[token.currency] || 0)}</span>
          </div>
        </div>
      `;
    }).join('');
    
    // Add click handlers
    listEl.querySelectorAll('.token-item').forEach(item => {
      item.addEventListener('click', () => {
        const currency = item.dataset.currency;
        const token = tokens.find(t => t.currency === currency);
        handlers.selectToken(token);
      });
    });
  },

  openModal(target) {
    state.currentModalTarget = target;
    const modal = document.getElementById('tokenModal');
    modal.classList.add('active');
    document.getElementById('tokenSearch').value = '';
    document.getElementById('tokenSearch').focus();
    ui.renderTokenList(state.tokens);
  },

  closeModal() {
    const modal = document.getElementById('tokenModal');
    modal.classList.remove('active');
    state.currentModalTarget = null;
  },

  toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme', state.theme === 'dark');
    localStorage.setItem('theme', state.theme);
    
    // Update icon
    const icon = document.querySelector('.theme-icon');
    icon.textContent = state.theme === 'light' ? '🌙' : '☀️';
  },

  initTheme() {
    if (state.theme === 'dark') {
      document.body.classList.add('dark-theme');
      const icon = document.querySelector('.theme-icon');
      if (icon) icon.textContent = '☀️';
    }
  },
};

// ===== Event Handlers =====
const handlers = {
  selectToken(token) {
    if (state.currentModalTarget === 'from') {
      state.selectedFromToken = token;
      ui.updateTokenDisplay('from', token);
      document.getElementById('input-amount').disabled = false;
      document.getElementById('input-amount').focus();
    } else if (state.currentModalTarget === 'to') {
      state.selectedToToken = token;
      ui.updateTokenDisplay('to', token);
    }
    
    ui.closeModal();
    handlers.calculateOutput();
    ui.updateSwapButton();
  },

  calculateOutput() {
    const fromToken = state.selectedFromToken;
    const toToken = state.selectedToToken;
    const inputAmount = utils.parseInputNumber(document.getElementById('input-amount').value);
    
    ui.hideError('fromError');
    
    if (!fromToken || !toToken || !inputAmount) {
      document.getElementById('output-amount').value = '';
      ui.updateUsdValue('from', 0, null);
      ui.updateUsdValue('to', 0, null);
      ui.updateExchangeInfo();
      ui.updateSwapButton();
      return;
    }
    
    // Check balance (removed - not in requirements)
    
    // Calculate output amount
    const fromPrice = state.prices[fromToken.currency];
    const toPrice = state.prices[toToken.currency];
    
    if (!fromPrice || !toPrice) {
      ui.showError('fromError', 'Price not available');
      document.getElementById('output-amount').value = '';
      ui.updateSwapButton();
      return;
    }
    
    const outputAmount = (inputAmount * fromPrice) / toPrice;
    document.getElementById('output-amount').value = utils.formatNumber(outputAmount, 6);
    
    // Update USD values
    ui.updateUsdValue('from', inputAmount, fromToken);
    ui.updateUsdValue('to', outputAmount, toToken);
    
    // Update exchange info
    ui.updateExchangeInfo();
    ui.updateSwapButton();
  },

  flipTokens() {
    // Swap the tokens
    const temp = state.selectedFromToken;
    state.selectedFromToken = state.selectedToToken;
    state.selectedToToken = temp;
    
    // Update UI
    ui.updateTokenDisplay('from', state.selectedFromToken);
    ui.updateTokenDisplay('to', state.selectedToToken);
    
    // Clear amounts
    document.getElementById('input-amount').value = '';
    document.getElementById('output-amount').value = '';
    
    // Recalculate
    handlers.calculateOutput();
  },

  async handleSwap(e) {
    e.preventDefault();
    
    if (state.isLoading) return;
    
    const btn = document.getElementById('swapBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');
    
    const fromToken = state.selectedFromToken;
    const toToken = state.selectedToToken;
    const inputAmount = utils.parseInputNumber(document.getElementById('input-amount').value);
    const outputAmount = utils.parseInputNumber(document.getElementById('output-amount').value);
    
    // Validate
    if (!fromToken || !toToken || !inputAmount || inputAmount <= 0) {
      ui.showToast('Please enter a valid amount', 'error');
      return;
    }
    
    // Show loading state
    state.isLoading = true;
    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    
    try {
      // Simulate swap
      const result = await api.simulateSwap(fromToken, toToken, inputAmount);
      
      if (result.success) {
        // Clear form
        document.getElementById('input-amount').value = '';
        document.getElementById('output-amount').value = '';
        ui.updateUsdValue('from', 0, null);
        ui.updateUsdValue('to', 0, null);
        ui.updateExchangeInfo();
        
        // Show success
        ui.showToast(
          `Successfully swapped ${utils.formatNumber(inputAmount, 4)} ${fromToken.currency} for ${utils.formatNumber(outputAmount, 4)} ${toToken.currency}`,
          'success'
        );
      }
    } catch (error) {
      console.error('Swap error:', error);
      ui.showToast('Swap failed. Please try again.', 'error');
    } finally {
      // Hide loading state
      state.isLoading = false;
      btnText.style.display = 'block';
      btnLoader.style.display = 'none';
      ui.updateSwapButton();
    }
  },
};

// ===== Input Handlers with Auto-update =====
const inputHandlers = {
  handleInputAmount(e) {
    let value = e.target.value;
    
    // Allow only numbers and decimal point
    if (!utils.validateDecimalInput(value) && value !== '') {
      e.target.value = value.slice(0, -1);
      return;
    }
    
    // Auto-update output immediately
    handlers.calculateOutput();
  },

  handleTokenSearch(e) {
    const query = e.target.value;
    ui.renderTokenList(state.tokens, query);
  },
};

// ===== Initialization =====
async function init() {
  try {
    // Initialize theme
    ui.initTheme();
    
    // Show loading state
    ui.showToast('Loading tokens...', 'success');
    
    // Fetch prices
    const { tokens, prices } = await api.fetchPrices();
    state.tokens = tokens.sort((a, b) => b.price - a.price); // Sort by price descending
    state.prices = prices;
    
    // Initialize event listeners
    setupEventListeners();
    
    console.log('✅ App initialized successfully');
    console.log(`📊 Loaded ${tokens.length} tokens`);
    
  } catch (error) {
    console.error('Initialization error:', error);
    ui.showToast('Failed to load tokens. Please refresh the page.', 'error');
  }
}

function setupEventListeners() {
  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', ui.toggleTheme);
  
  // Token selection buttons
  document.getElementById('fromTokenBtn').addEventListener('click', () => ui.openModal('from'));
  document.getElementById('toTokenBtn').addEventListener('click', () => ui.openModal('to'));
  
  // Modal controls
  document.getElementById('closeModal').addEventListener('click', ui.closeModal);
  document.getElementById('modalOverlay').addEventListener('click', ui.closeModal);
  
  // Search
  document.getElementById('tokenSearch').addEventListener('input', inputHandlers.handleTokenSearch);
  
  // Input amount
  document.getElementById('input-amount').addEventListener('input', inputHandlers.handleInputAmount);
  
  // Flip button
  document.getElementById('flipBtn').addEventListener('click', handlers.flipTokens);
  
  // Form submission
  document.getElementById('swapForm').addEventListener('submit', handlers.handleSwap);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape') {
      ui.closeModal();
    }
  });
}

// Start the app
init();
