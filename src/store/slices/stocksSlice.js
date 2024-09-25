// src/features/stocksSlice.js
import { createSlice } from '@reduxjs/toolkit';

const stocksSlice = createSlice({
  name: 'stocks',
  initialState: {
    stocks: [
      { id: 1, name: 'Apple', price: 150, image: 'https://placehold.co/4000?text=Hello+World', quantity: 100 },
      { id: 2, name: 'Tesla', price: 700, image: 'https://placehold.co/6000x4000', quantity: 50 },
      // Add more stocks with quantity
    ],
    purchasedStocks: [],
  },
  reducers: {
    buyStock: (state, action) => {
      const { stockId, quantity } = action.payload;
      const stock = state.stocks.find((s) => s.id === stockId);

      if (stock && stock.quantity >= quantity) {
        // Reduce stock quantity
        stock.quantity -= quantity;

        // Add to purchased stocks
        state.purchasedStocks.push({
          ...stock,
          purchasedQuantity: quantity,
        });

        // If stock quantity becomes zero, remove it from the list
        if (stock.quantity === 0) {
          state.stocks = state.stocks.filter((s) => s.id !== stockId);
        }
      }
    },
    // Add additional reducers as needed
  },
});

export const { buyStock } = stocksSlice.actions;
export default stocksSlice.reducer;
