import { createSlice } from '@reduxjs/toolkit';

const defaultStocks = [
  { id: 1, name: 'Apple', price: 150, image: 'https://placehold.co/4000?text=Hello+World', quantity: 100 },
  { id: 2, name: 'Tesla', price: 700, image: 'https://placehold.co/6000x4000', quantity: 50 },
];

// Helper functions to handle localStorage
const loadState = () => {
  const savedStocks = localStorage.getItem('stocks');
  const savedPurchasedStocks = localStorage.getItem('purchasedStocks');
  
  return {
    stocks: savedStocks ? JSON.parse(savedStocks) : defaultStocks,
    purchasedStocks: savedPurchasedStocks ? JSON.parse(savedPurchasedStocks) : [],
  };
};

const saveState = (stocks, purchasedStocks) => {
  localStorage.setItem('stocks', JSON.stringify(stocks));
  localStorage.setItem('purchasedStocks', JSON.stringify(purchasedStocks));
};

const initialState = loadState();

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    buyStock: (state, action) => {
      const { stockId, quantity } = action.payload;
      const stock = state.stocks.find((s) => s.id === stockId);

      if (stock && stock.quantity >= quantity) {
        stock.quantity -= quantity;

        const purchasedStock = state.purchasedStocks.find((s) => s.id === stockId);

        if (purchasedStock) {
          purchasedStock.purchasedQuantity += quantity;
        } else {
          state.purchasedStocks.push({ ...stock, purchasedQuantity: quantity });
        }

        if (stock.quantity === 0) {
          state.stocks = state.stocks.filter((s) => s.id !== stockId);
        }

        // Save to localStorage
        saveState(state.stocks, state.purchasedStocks);
      }
    },
    sellStock: (state, action) => {
      const { stockId, quantity } = action.payload;
      const purchasedStock = state.purchasedStocks.find((s) => s.id === stockId);

      if (purchasedStock && purchasedStock.purchasedQuantity >= quantity) {
        purchasedStock.purchasedQuantity -= quantity;

        let availableStock = state.stocks.find((s) => s.id === stockId);

        if (availableStock) {
          availableStock.quantity += quantity;
        } else {
          state.stocks.push({
            id: purchasedStock.id,
            name: purchasedStock.name,
            price: purchasedStock.price,
            image: purchasedStock.image,
            quantity: quantity,
          });
        }

        // Remove from purchased stocks if all shares are sold
        if (purchasedStock.purchasedQuantity === 0) {
          state.purchasedStocks = state.purchasedStocks.filter((s) => s.id !== stockId);
        }

        // Save to localStorage
        saveState(state.stocks, state.purchasedStocks);
      }
    },
    resetStocks: (state) => {
      state.stocks = defaultStocks;
      state.purchasedStocks = [];
    },
    updateStockPrices: (state, action) => {
      const newPrices = action.payload; // New stock prices
      
      // Update prices for stocks
      state.stocks = state.stocks.map(stock => {
        const updatedStock = newPrices.find(s => s.id === stock.id);
        return updatedStock ? { ...stock, price: updatedStock.price } : stock;
      });

      // Update prices for purchased stocks
      state.purchasedStocks = state.purchasedStocks.map(purchasedStock => {
        const updatedStock = newPrices.find(s => s.id === purchasedStock.id);
        return updatedStock ? { ...purchasedStock, price: updatedStock.price } : purchasedStock;
      });

      // Save updated prices to localStorage
      saveState(state.stocks, state.purchasedStocks);
    },
  },
});

export const { buyStock, sellStock, resetStocks, updateStockPrices } = stocksSlice.actions;
export default stocksSlice.reducer;
