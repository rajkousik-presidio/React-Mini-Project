import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchStocks = createAsyncThunk('stocks/fetchStocks', async () => {
  const response = await axios.get('http://localhost:3000/stocks');
  return response.data;
});

// Helper functions to handle localStorage
const loadState = () => {
  const savedStocks = localStorage.getItem('stocks');
  const savedPurchasedStocks = localStorage.getItem('purchasedStocks');
  const savedPriceStatus = localStorage.getItem('priceStatus'); // Load price status

  return {
    stocks: savedStocks ? JSON.parse(savedStocks) : [],
    purchasedStocks: savedPurchasedStocks ? JSON.parse(savedPurchasedStocks) : [],
    priceStatus: savedPriceStatus ? JSON.parse(savedPriceStatus) : {}, // Initialize price status
  };
};

// Helper function to save state to localStorage
const saveState = (stocks, purchasedStocks, priceStatus) => {
  localStorage.setItem('stocks', JSON.stringify(stocks));
  localStorage.setItem('purchasedStocks', JSON.stringify(purchasedStocks));
  localStorage.setItem('priceStatus', JSON.stringify(priceStatus)); // Save price status
};

const initialState = loadState();

const stocksSlice = createSlice({
  name: 'stocks',
  initialState: {
    stocks: initialState.stocks,
    purchasedStocks: initialState.purchasedStocks,
    priceStatus: initialState.priceStatus, // Add priceStatus to state
    status: 'idle',
    error: null,
  },
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

        saveState(state.stocks, state.purchasedStocks, state.priceStatus);
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

        if (purchasedStock.purchasedQuantity === 0) {
          state.purchasedStocks = state.purchasedStocks.filter((s) => s.id !== stockId);
        }

        saveState(state.stocks, state.purchasedStocks, state.priceStatus);
      }
    },
    resetStocks: (state) => {
      state.stocks = initialState.stocks;
      state.purchasedStocks = [];
      state.priceStatus = {}; // Reset price status
      saveState(state.stocks, state.purchasedStocks, state.priceStatus);
    },
    updateStockPrices: (state, action) => {
      const newPrices = action.payload;

      // Update stock prices and status
      state.stocks.forEach(stock => {
        const updatedStock = newPrices.find(s => s.id === stock.id);
        if (updatedStock) {
          const prevPrice = state.priceStatus[stock.id]?.price || stock.price;
          let status = 'equal';
          if (updatedStock.price > prevPrice) status = 'increase';
          else if (updatedStock.price < prevPrice) status = 'decrease';

          state.priceStatus[stock.id] = { price: updatedStock.price, status }; // Update price status
          stock.price = updatedStock.price;
        }
      });

      // Update purchased stock prices and status
      state.purchasedStocks.forEach(purchasedStock => {
        const updatedStock = newPrices.find(s => s.id === purchasedStock.id);
        if (updatedStock) {
          const prevPrice = state.priceStatus[purchasedStock.id]?.price || purchasedStock.price;
          let status = 'equal';
          console.log("slice2 prices",updatedStock.price, prevPrice);
          if (updatedStock.price > prevPrice) status = 'increase';
          else if (updatedStock.price < prevPrice) status = 'decrease';
          console.log("slice 2 ", status)
          // state.priceStatus[purchasedStock.id] = { price: updatedStock.price, status }; // Update price status
          purchasedStock.price = updatedStock.price;
          console.log("slice2",state.priceStatus[purchasedStock.id]);

        }
      });
      console.log("final",state.priceStatus);
      // Save updated state to localStorage
      saveState(state.stocks, state.purchasedStocks, state.priceStatus);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stocks = action.payload;

        // Initialize price status on fetch
        action.payload.forEach(stock => {
          if (!state.priceStatus[stock.id]) {
            state.priceStatus[stock.id] = { price: stock.price, status: 'equal' };
          }
        });

        saveState(state.stocks, state.purchasedStocks, state.priceStatus);
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { buyStock, sellStock, resetStocks, updateStockPrices } = stocksSlice.actions;
export default stocksSlice.reducer;
