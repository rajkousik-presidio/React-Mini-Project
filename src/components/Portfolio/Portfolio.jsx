import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sellStock } from "../../store/slices/stocksSlice";
import HeaderStocks from "../HeaderStocks/HeaderStocks";
import StockCard from "../StockCard/StockCard";
import "./Portfolio.scss";
import { PortfolioContext } from "../../contexts/PortfolioContext";
import { toast } from "react-toastify";

const Portfolio = () => {
  const { balance, setBalance } = useContext(PortfolioContext);
  const dispatch = useDispatch();
  const purchasedStocks = useSelector((state) => state.stocks.purchasedStocks);
  const [filteredStocks, setFilteredStocks] = useState(purchasedStocks);

  const handleSearch = (searchTerm) => {
    const filtered = purchasedStocks.filter((stock) =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  const handleSort = (order) => {
    const sorted = [...filteredStocks].sort((a, b) => {
      if (order === "asc") return a.price - b.price;
      if (order === "desc") return b.price - a.price;
      return 0;
    });
    setFilteredStocks(sorted);
  };

  const handleSellStock = (stock) => {
    const quantity = parseInt(
      prompt(`How many shares of ${stock.name} would you like to sell?`),
      10
    );

    if (!quantity || quantity <= 0 || isNaN(quantity)) {
      toast.error("Invalid quantity entered");
      return;
    }

    if (quantity > stock.purchasedQuantity) {
      toast.error(
        `You only own ${stock.purchasedQuantity} shares of ${stock.name}.`
      );
      return;
    }

    // Calculate total sell value
    const totalGain = stock.price * quantity;

    // Proceed with sale
    dispatch(sellStock({ stockId: stock.id, quantity }));
    setBalance(balance + totalGain);
    toast.success(`Successfully sold ${quantity} shares of ${stock.name}`);
  };

  useEffect(() => {
    setFilteredStocks(purchasedStocks);
  }, [purchasedStocks]);

  return (
    <div className="portfolio">
      <HeaderStocks
        onSearch={handleSearch}
        onSort={handleSort}
        totalAmount={balance}
      />
      <div className="stocks-list">
        {filteredStocks.length > 0 ? (
          filteredStocks.map((stock) => (
            <StockCard key={stock.id} stock={stock} onSell={handleSellStock} isPortfolio={true}/>
          ))
        ) : (
          <p>No stocks in your portfolio yet.</p>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
