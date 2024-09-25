import { useContext } from "react";
import { PortfolioContext } from "../../contexts/PortfolioContext";
import { FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  const { user, setUser, setBalance } = useContext(PortfolioContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("stocks");
    localStorage.removeItem("purchasedStocks");

    setUser(null);
    setBalance(0);
    navigate("/");
  };

  return (
    <div className="header">
      <div className="header-left">
        <FaMoneyBillWave className="app-icon" />
        <h2>StockTracker</h2>
      </div>
      <div className="header-right">
        {user && (
          <div className='profile'>
            <p>Hola {user.username ? <span> {user.username}!</span> : <span>User</span>}</p>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
