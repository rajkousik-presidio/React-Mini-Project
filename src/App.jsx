import { useContext, useEffect } from 'react';
import { PortfolioContext } from './contexts/PortfolioContext';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import WelcomePage from './components/WelcomePage/WelcomePage';
import BuyStocks from './components/BuyStocks/BuyStocks';
import Portfolio from './components/Portfolio/Portfolio';
import ErrorPage from './components/ErrorPage/ErrorPage';
import LoadingPage from './components/LoadingPage/LoadingPage';
import Header from './components/Header/Header';

const App = () => {
  const { user, setUser, setBalance } = useContext(PortfolioContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setBalance(userData.balance);
      navigate('/buy'); // Redirect to buy stocks if already logged in
    }
  }, [setUser, setBalance, navigate]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/buy" /> : <WelcomePage />} />
        <Route path="/buy" element={<BuyStocks />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/loading" element={<LoadingPage />} />
      </Routes>
    </>
  );
};

export default App;
