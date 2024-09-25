import { useContext } from "react";
import { PortfolioContext } from "../../contexts/PortfolioContext";
import { FaMoneyBillWave } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import { resetStocks } from "../../store/slices/stocksSlice";
import { useDispatch } from "react-redux";

const Header = () => {
  const { user, setUser, setBalance } = useContext(PortfolioContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("stocks");
    localStorage.removeItem("purchasedStocks");

    setUser(null);
    setBalance(0);

    dispatch(resetStocks());

    navigate("/");
  };

  return (
    <div className="header">
      <div className="header-left">
        <FaMoneyBillWave className="app-icon" />
        <h2 className="app-name"><Link to="/" className="app-name">StockTracker</Link></h2>
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
