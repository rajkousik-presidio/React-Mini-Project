import React from 'react';
import { FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa';
import './StockCard.scss';

const StockCard = ({ stock, onBuy, onSell, isPortfolio, priceStatus }) => {
  const getPriceChangeIcon = () => {
    switch (priceStatus) {
      case 'increase':
        return <FaArrowUp style={{ color: 'green' }} />;
      case 'decrease':
        return <FaArrowDown style={{ color: 'red' }} />;
      default:
        return <FaEquals style={{ color: 'gray' }} />;
    }
  };

  return (
    <div className="stock-card">
      <img src={stock.image} alt={stock.name} />
      <div className="stock-description">
        <div className="row">
          <h3>{stock.name}</h3>
          <p>
            Price: ${stock.price} {getPriceChangeIcon()}
          </p>
        </div>

        {!isPortfolio && (
          <div className="row">
            <p>Available: {stock.quantity} shares</p>
            <button onClick={() => onBuy(stock)}>Buy</button>
          </div>
        )}

        {isPortfolio && (
          <div className="row">
            <p>Owned: {stock.purchasedQuantity} shares</p>
            <button onClick={() => onSell(stock)}>Sell</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockCard;
