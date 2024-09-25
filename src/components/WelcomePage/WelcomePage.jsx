import { useState, useContext } from "react";
import { PortfolioContext } from "../../contexts/PortfolioContext";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.scss";
import wave from "../../assets/wave.svg";
import illustration from "../../assets/illustration.jpg";
import { FaMoneyBillWave } from "react-icons/fa";

const WelcomePage = () => {
  const { setUser, setBalance } = useContext(PortfolioContext);
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username) return "Username is required";
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0)
      return "Please enter a valid amount";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      setError(errorMsg);
    } else {
      const userInfo = { username, balance: parseFloat(amount) };
      localStorage.setItem("username", JSON.stringify(userInfo));
      setUser(userInfo);
      setBalance(parseFloat(amount));
      navigate("/buy");
    }
  };

    return (
      <>
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="text-section">
          <h1>
            Build <span>Your Wealth</span> Today
          </h1>
          <p>
            Start investing in the stock market to grow your portfolio. Manage
            your assets and reach your financial goals.
          </p>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Enter your initial balance"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-chart-line"></i> Start Investing
            </button>
          </form>
        </div>

        <div className="image-section">
          <img src={illustration} alt="Illustration" className="illustration" />
        </div>
      </div>
            </div>
            </>
  );
};

export default WelcomePage;
