import { useContext, useEffect, useState } from "react";
import { PortfolioContext } from "../../contexts/PortfolioContext";
import { FaMoneyBillWave } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetStocks, updateStockPrices } from "../../store/slices/stocksSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import CircularTimer from "../CircularTimer/CircularTimer";
import "./Header.scss";

const Header = () => {
  const { user, setUser, setBalance } = useContext(PortfolioContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [timer, setTimer] = useState(60); // Centralized timer
  const stocks = useSelector((state) => state.stocks.stocks);

  // Handle logout and reset
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setBalance(0);
    dispatch(resetStocks());
    navigate("/");
  };

  // Generate random stock prices
  const getRandomPrice = () => {
    const random = Math.random();
    return random < 0.6
      ? Math.floor(Math.random() * (1000 - 400 + 1)) + 400 // 60% chance for 400-1000
      : Math.floor(Math.random() * (1500 - 100 + 1)) + 100; // 40% chance for 100-1500
  };

  // Function to refresh stock prices
  const refreshStockPrices = () => {
    const updatedStocks = stocks.map((stock) => ({
      ...stock,
      price: getRandomPrice(),
    }));
    dispatch(updateStockPrices(updatedStocks));
  };

  // Timer countdown and stock price refresh logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          refreshStockPrices(); // Refresh when timer reaches 1
          return 60; // Reset timer to 60
        }
        return prev - 1; // Decrement timer
      });
    }, 1000); // 1-second interval

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [stocks]); // Dependency on stocks

  return (
    <div className="header d-flex justify-content-between align-items-center p-3">
      <div className="header-left d-flex align-items-center">
        <FaMoneyBillWave className="app-icon me-2" />
        <h2 className="app-name">
          <Link to="/" className="text-decoration-none text-dark app-name">StockTracker</Link>
        </h2>
      </div>

      <div className="header-right d-flex align-items-center">
        {user && (
          <>
            {/* Pass the centralized timer value and refresh handler to CircularTimer */}
            <CircularTimer duration={60} timer={timer} /> 
            <div className="profile d-flex align-items-center">
              <p className="m-0">Hola {user.username ? <span>{user.username}!</span> : <span>User</span>}</p>
              <button className="btn btn-secondary ms-3" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
