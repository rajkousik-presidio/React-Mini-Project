import { useContext, useEffect, useState } from "react";
import { PortfolioContext } from "../../contexts/PortfolioContext";
import { FaMoneyBillWave, FaSyncAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetStocks } from "../../store/slices/stocksSlice";
import { useSelector } from "react-redux";
import "./Header.scss";
import { updateStockPrices } from "../../store/slices/stocksSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import CircularTimer from "../CircularTimer/CircularTimer";

const Header = () => {
  const { user, setUser, setBalance } = useContext(PortfolioContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [timer, setTimer] = useState(60);
  const stocks = useSelector((state) => state.stocks.stocks);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("stocks");
    localStorage.removeItem("purchasedStocks");
    setUser(null);
    setBalance(0);
    dispatch(resetStocks());
    navigate("/");
  };

  const getRandomPrice = () => {
    const random = Math.random();
    if (random < 0.6) {
      return Math.floor(Math.random() * (1000 - 400 + 1)) + 400; // 60% chance for 400-1000
    } else {
      return Math.floor(Math.random() * (1500 - 100 + 1)) + 100; // 40% chance for 100-1500
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 60));
      if (timer === 0) {
        refreshStockPrices();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const refreshStockPrices = () => {
    const updatedStocks = stocks.map(stock => ({
      ...stock,
      price: getRandomPrice()
    }));
    dispatch(updateStockPrices(updatedStocks));
  };

  return (
    <div className="header d-flex justify-content-between align-items-center p-3">
      <div className="header-left d-flex align-items-center">
        <FaMoneyBillWave className="app-icon me-2" />
        <h2 className="app-name">
          <Link to="/" className="text-decoration-none text-dark app-name">StockTracker</Link>
        </h2>
      </div>

      <div className="header-right d-flex align-items-center">
        <CircularTimer duration={60} onRefresh={refreshStockPrices} />
        {user && (
          <div className="profile d-flex align-items-center">
            <p className="m-0">Hola {user.username ? <span> {user.username}!</span> : <span>User</span>}</p>
            <button className="btn btn-secondary ms-3" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
