import { useContext } from 'react';
import { PortfolioContext } from '../../contexts/PortfolioContext';

const Portfolio = () => {
  const { portfolio, setPortfolio, balance, setBalance } = useContext(PortfolioContext);

  const sellStock = (stock) => {
    setPortfolio(portfolio.filter(item => item.id !== stock.id));
    setBalance(balance + stock.price);
  };

  return (
    <div className="container">
      <h2>Your Portfolio</h2>
      <ul>
        {portfolio.map(stock => (
          <li key={stock.id}>
            {stock.name} - ${stock.price}
            <button onClick={() => sellStock(stock)}>Sell</button>
          </li>
        ))}
      </ul>
      <p>Balance: ${balance}</p>
    </div>
  );
};

export default Portfolio;
