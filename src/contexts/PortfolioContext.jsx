import React, { createContext, useState } from 'react';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('username');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);

  return (
    <PortfolioContext.Provider value={{ user, setUser, portfolio, setPortfolio, balance, setBalance }}>
      {children}
    </PortfolioContext.Provider>
  );
};
