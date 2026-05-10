# Problem 2: SwapFlow - Fancy Currency Exchange Form

## 📖 Overview

**SwapFlow** is a modern, production-ready cryptocurrency exchange interface that allows users to swap between different tokens with real-time price calculations. The application features a beautiful glassmorphism design, comprehensive validation, and smooth user interactions.

This project demonstrates advanced frontend development skills including:
- Modern JavaScript (ES6+) with modular architecture
- Real-time API integration and data handling
- Advanced CSS with animations and responsive design
- User experience design and interaction patterns
- Production-ready code quality and error handling

**Live Demo:** [Deploy to see it in action!](DEPLOYMENT.md)

---

# Task

Create a currency swap form based on the template provided in the folder. A user would use this form to swap assets from one currency to another.

*You may use any third party plugin, library, and/or framework for this problem.*

1. You may add input validation/error messages to make the form interactive.
2. Your submission will be rated on its usage intuitiveness and visual attractiveness.
3. Show us your frontend development and design skills, feel free to totally disregard the provided files for this problem.
4. You may use this [repo](https://github.com/Switcheo/token-icons/tree/main/tokens) for token images, e.g. [SVG image](https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/SWTH.svg).
5. You may use this [URL](https://interview.switcheo.com/prices.json) for token price information and to compute exchange rates (not every token has a price, those that do not can be omitted).

<aside>
✨ Bonus: extra points if you use [Vite](https://vite.dev/) for this task!

</aside>

Please submit your solution using the files provided in the skeletal repo, including any additional files your solution may use.

<aside>
💡 Hint: feel free to simulate or mock interactions with a backend service, e.g. implement a loading indicator with a timeout delay for the submit button is good enough.

</aside>

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (opens automatically at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Documentation

- **[SOLUTION.md](SOLUTION.md)** - Complete solution documentation and features
- **[TESTING.md](TESTING.md)** - Testing guide and validation scenarios
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Netlify deployment guide

## ✨ Key Features Implemented

✅ **Built with Vite** (Bonus requirement)  
✅ Real-time token swapping with live exchange rates  
✅ **Balance Tracking System** with persistent storage  
✅ **Wallet Balance Overview** with portfolio value display  
✅ **MAX Button** for quick balance input  
✅ **Insufficient Balance Validation** with real-time feedback  
✅ **Balance Updates** after successful swaps  
✅ Modern glassmorphism UI with animated gradient background  
✅ Fully responsive design (mobile, tablet, desktop)  
✅ Comprehensive input validation and error handling  
✅ Token search with instant filtering  
✅ USD value display for both tokens  
✅ Exchange rate information  
✅ Swap direction flip button  
✅ Loading states with simulated backend delay  
✅ Toast notifications for user feedback  
✅ Smooth animations and transitions  
✅ Accessibility features (ARIA labels, keyboard navigation)

## 🎯 Balance Management Features

### 💰 Wallet Balance System
- **Persistent Storage**: Balances saved in localStorage and persist across sessions
- **Pre-loaded Demo Balances**: Starts with realistic token amounts (5.5 ETH, 10K USDC, etc.)
- **Real-time Balance Display**: Shows current balance for each selected token
- **MAX Button**: Quick-fill input with entire token balance
- **Balance Validation**: Prevents swaps exceeding available balance
- **Visual Feedback**: Clear error messages for insufficient funds

### 📊 Wallet Overview Modal
- View all tokens with current balances
- See USD value for each token
- Total portfolio value calculation
- Price information per token
- Sorted by value (highest first)
- Reset balances for testing

### 🔄 Balance Updates
- Automatic deduction from source token
- Automatic addition to destination token
- Accurate calculations using real exchange rates
- Persistent changes across page refreshes

## 🛠️ Technical Stack

- **Vite** 5.2.0 - Fast build tool and dev server
- **Vanilla JavaScript** (ES6+) - Pure JavaScript, no framework dependencies
- **CSS3** - Modern CSS with custom properties, animations, and responsive design
- **HTML5** - Semantic markup with accessibility features

## 📁 Project Structure

```
problem2/
├── index.html                    # Main HTML structure
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── netlify.toml                 # Netlify deployment config
├── readme.md                    # This file
├── SOLUTION.md                  # Detailed solution documentation
├── BALANCE-FEATURE.md           # Balance tracking feature docs
├── TESTING.md                   # Testing guide
└── DEPLOYMENT.md                # Deployment instructions
└── src/
    ├── main.jsx                 # Application entry point
    ├── App.jsx                  # Main app component
    ├── index.css                # Global styles and animations
    ├── components/
    │   ├── SwapCard.jsx         # Main swap interface
    │   ├── TokenInput.jsx       # Token input with balance
    │   ├── TokenModal.jsx       # Token selection modal
    │   ├── Toast.jsx            # Toast notifications
    │   └── BalanceOverview.jsx  # Wallet balance modal
    ├── hooks/
    │   ├── useTokenData.js      # Token data fetching
    │   └── useBalances.js       # Balance management
    └── utils/
        ├── api.js               # API simulation
        └── helpers.js           # Utility functions
```

## 🎯 Solution Highlights

- **Clean Architecture:** Organized React components with custom hooks for state management
- **Balance Management:** Comprehensive balance tracking with localStorage persistence
- **Error Handling:** Multi-layered validation with helpful error messages
- **Performance:** Optimized rendering with React hooks and memoization
- **User Experience:** Intuitive interface with visual feedback and balance awareness
- **Code Quality:** Well-documented, maintainable code following React best practices
- **Production Ready:** Includes build optimization, deployment config, and comprehensive documentation
- **Real-world Features:** Balance tracking, validation, and wallet overview mirror production swap interfaces

---

**Author:** Built as part of 99Tech Code Challenge #1  
**Tech Stack:** Vite + Vanilla JavaScript + CSS3  
**Status:** ✅ Production Ready