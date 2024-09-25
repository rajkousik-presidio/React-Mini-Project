// HeaderStocks.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './HeaderStocks.scss';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const HeaderStocks = ({ onSearch, onSort, totalAmount }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const location = useLocation();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    onSort(newOrder);
  };

  return (
    <div className="header-stocks">
      <div className="header-left">
        <Link
          to="/buy"
          className={location.pathname === "/buy" ? "active" : ""}
        >
          Stocks
        </Link>
        <Link
          to="/portfolio"
          className={location.pathname === "/portfolio" ? "active" : ""}
        >
          Portfolio
        </Link>
      </div>
      <div className="header-right">
        <p>Total: <span>${totalAmount}</span></p>
        <input
          type="text"
          placeholder="Search stocks"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="sort-button" onClick={toggleSortOrder}>
          {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
          Sort by price
        </button>
      </div>
    </div>
  );
};

export default HeaderStocks;
