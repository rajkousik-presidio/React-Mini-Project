// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from './slices/stocksSlice';

const store = configureStore({
  reducer: {
    stocks: stocksReducer,
  },
});

export default store;
