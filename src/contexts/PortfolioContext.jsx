import React, { createContext, useState, useEffect } from 'react';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  // Persist user from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('username');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Persist portfolio from localStorage
  const [portfolio, setPortfolio] = useState(() => {
    const storedPortfolio = localStorage.getItem('portfolio');
    return storedPortfolio ? JSON.parse(storedPortfolio) : [];
  });

  // Persist balance from localStorage
  const [balance, setBalance] = useState(() => {
    const storedBalance = localStorage.getItem('balance');
    return storedBalance ? parseFloat(storedBalance) : 0;
  });

  // Update localStorage whenever portfolio changes
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Update localStorage whenever balance changes
  useEffect(() => {
    localStorage.setItem('balance', balance);
  }, [balance]);

  return (
    <PortfolioContext.Provider
      value={{ user, setUser, portfolio, setPortfolio, balance, setBalance }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
