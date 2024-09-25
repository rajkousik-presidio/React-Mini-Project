// StockCard.jsx
import React from "react";
import "./StockCard.scss";

const StockCard = ({ stock, onBuy }) => {
  return (
    <div className="stock-card">
      <img src={stock.image} alt={stock.name} />
      <div className="stock-description">
        <div className="row">
          <h3>{stock.name}</h3>
          <p>Price: ${stock.price}</p>
        </div>
        <div className="row">
          <p>Available: {stock.quantity} shares</p>
          <button onClick={() => onBuy(stock)}>Buy</button>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
