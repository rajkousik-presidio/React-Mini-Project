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
    setUser(null);
    setBalance(0);
    navigate("/"); // Redirect to welcome page
  };

  return (
    <div className="header">
      <div className="header-left">
        <FaMoneyBillWave className="app-icon" />
        <h2>StockTracker</h2> {/* App name */}
      </div>
      <div className="header-right">
        {user && ( // Show logout button only if the user is logged in
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
