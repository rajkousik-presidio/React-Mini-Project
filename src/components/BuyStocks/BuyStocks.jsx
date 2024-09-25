// BuyStocks.jsx
import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { buyStock } from '../../store/slices/stocksSlice';
import HeaderStocks from '../HeaderStocks/HeaderStocks';
import StockCard from '../StockCard/StockCard';
import './BuyStocks.scss';
import { PortfolioContext } from '../../contexts/PortfolioContext';
import { toast } from 'react-toastify'; // Make sure to install react-toastify

const BuyStocks = () => {
  const { balance, setBalance } = useContext(PortfolioContext);
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stocks.stocks);
  const [filteredStocks, setFilteredStocks] = React.useState(stocks);

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
    // Prompt user for the quantity
    const quantity = parseInt(prompt(`How many shares of ${stock.name} would you like to buy?`), 10);

    // If invalid quantity, show error
    if (!quantity || quantity <= 0 || isNaN(quantity)) {
      toast.error('Invalid quantity entered');
      return;
    }

    // Check if the requested quantity is greater than available stock
    if (quantity > stock.quantity) {
      toast.error(`Insufficient stock. Only ${stock.quantity} shares of ${stock.name} are available.`);
      return;
    }

    // Calculate total cost
    const totalCost = stock.price * quantity;

    // Check if user has enough balance
    if (balance < totalCost) {
      toast.error('Insufficient balance');
      return;
    }

    // If sufficient balance, proceed with purchase
    dispatch(buyStock({ stockId: stock.id, quantity }));
    setBalance(balance - totalCost); // Deduct from balance
    toast.success(`Successfully purchased ${quantity} shares of ${stock.name}`);
  };

  React.useEffect(() => {
    setFilteredStocks(stocks);
  }, [stocks]);

  return (
    <div className="buy-stocks">
      <HeaderStocks onSearch={handleSearch} onSort={handleSort} totalAmount={balance} />
      <div className="stocks-list">
        {filteredStocks.map((stock) => (
          <StockCard key={stock.id} stock={stock} onBuy={handleBuyStock} />
        ))}
      </div>
    </div>
  );
};

export default BuyStocks;