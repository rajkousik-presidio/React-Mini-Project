import React, { useContext, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { buyStock } from '../../store/slices/stocksSlice';
import HeaderStocks from '../HeaderStocks/HeaderStocks';
import StockCard from '../StockCard/StockCard';
import './BuyStocks.scss';
import { PortfolioContext } from '../../contexts/PortfolioContext';
import { toast } from 'react-toastify';

const BuyStocks = () => {
  const { balance, setBalance } = useContext(PortfolioContext);
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stocks.stocks);

  const previousPricesRef = useRef({});
  const [filteredStocks, setFilteredStocks] = useState(stocks);

  const handleSearch = (searchTerm) => {
    const filtered = stocks.filter((stock) =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  const handleSort = (order) => {
    const sorted = [...filteredStocks].sort((a, b) => {
      if (order === 'asc') return a.price - b.price;
      if (order === 'desc') return b.price - a.price;
      return 0;
    });
    setFilteredStocks(sorted);
  };

  const handleBuyStock = (stock) => {
    const quantity = parseInt(prompt(`How many shares of ${stock.name} would you like to buy?`), 10);

    if (!quantity || quantity <= 0 || isNaN(quantity)) {
      toast.error('Invalid quantity entered');
      return;
    }

    if (quantity > stock.quantity) {
      toast.error(`Insufficient stock. Only ${stock.quantity} shares of ${stock.name} are available.`);
      return;
    }

    const totalCost = stock.price * quantity;

    if (balance < totalCost) {
      toast.error('Insufficient balance');
      return;
    }

    dispatch(buyStock({ stockId: stock.id, quantity }));
    setBalance(balance - totalCost);
    toast.success(`Successfully purchased ${quantity} shares of ${stock.name}`);
  };

  useEffect(() => {
    // Track price changes and update the ref
    const newPrices = {};
    stocks.forEach((stock) => {
      const prevPrice = previousPricesRef.current[stock.id] || stock.price;
      let status = 'equal';
      if (stock.price > prevPrice.price) status = 'increase';
      else if (stock.price < prevPrice.price) status = 'decrease';
      
      newPrices[stock.id] = { price: stock.price, status };
    });

    previousPricesRef.current = newPrices;
    setFilteredStocks(stocks);
  }, [stocks]); // Only trigger when `stocks` change

  return (
    <div className="buy-stocks">
      <HeaderStocks onSearch={handleSearch} onSort={handleSort} totalAmount={balance} />
      <div className="stocks-list">
        {filteredStocks.map((stock) => (
          <StockCard 
            key={stock.id} 
            stock={stock} 
            onBuy={handleBuyStock} 
            priceStatus={previousPricesRef.current[stock.id]?.status || 'equal'} 
          />
        ))}
      </div>
    </div>
  );
};

export default BuyStocks;
