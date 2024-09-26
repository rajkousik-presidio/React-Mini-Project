import React, { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStocks, buyStock } from '../../store/slices/stocksSlice'; // Import fetchStocks
import HeaderStocks from '../HeaderStocks/HeaderStocks';
import StockCard from '../StockCard/StockCard';
import './BuyStocks.scss';
import { PortfolioContext } from '../../contexts/PortfolioContext';
import { toast } from 'react-toastify';

const BuyStocks = () => {
  const { balance, setBalance } = useContext(PortfolioContext);
  const dispatch = useDispatch();

  const stocks = useSelector((state) => state.stocks.stocks);
  const stockStatus = useSelector((state) => state.stocks.status);
  const error = useSelector((state) => state.stocks.error);
  const priceStatus = useSelector((state) => state.stocks.priceStatus); // Get price status from Redux state

  const [filteredStocks, setFilteredStocks] = useState([]);

  // Fetch stocks when component mounts
  useEffect(() => {
    if (stockStatus === 'idle') {
      dispatch(fetchStocks());
    }
  }, [stockStatus, dispatch]);

  // Set filtered stocks after fetch succeeds
  useEffect(() => {
    if (stockStatus === 'succeeded') {
      setFilteredStocks(stocks);
    }
  }, [stocks, stockStatus]);

  // Handle search functionality
  const handleSearch = (searchTerm) => {
    const filtered = stocks.filter((stock) =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  // Handle sorting by price (ascending or descending)
  const handleSort = (order) => {
    const sorted = [...filteredStocks].sort((a, b) => {
      if (order === 'asc') return a.price - b.price;
      if (order === 'desc') return b.price - a.price;
      return 0;
    });
    setFilteredStocks(sorted);
  };

  // Handle buying stock logic
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

    // Dispatch buyStock action and update balance
    dispatch(buyStock({ stockId: stock.id, quantity }));
    setBalance(balance - totalCost);
    toast.success(`Successfully purchased ${quantity} shares of ${stock.name}`);
  };

  if (stockStatus === 'loading') {
    return <div>Loading stocks...</div>;
  }

  if (stockStatus === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="buy-stocks">
      <HeaderStocks onSearch={handleSearch} onSort={handleSort} totalAmount={balance} />
      <div className="stocks-list">
        {filteredStocks.map((stock) => (
          <>
          <StockCard 
            key={stock.id} 
            stock={stock} 
            onBuy={handleBuyStock} 
            priceStatus={priceStatus[stock.id]?.status || 'equal'} // Get price status from Redux state
            />
            {console.log("BuyStocks",priceStatus[stock.id])
            }
          </>
        ))}
      </div>
    </div>
  );
};

export default BuyStocks;
