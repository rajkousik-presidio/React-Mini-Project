import { useContext, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PortfolioContext } from './contexts/PortfolioContext';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import WelcomePage from './components/WelcomePage/WelcomePage';
import BuyStocks from './components/BuyStocks/BuyStocks';
import Portfolio from './components/Portfolio/Portfolio';
import ErrorPage from './components/ErrorPage/ErrorPage';
import LoadingPage from './components/LoadingPage/LoadingPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import store from './store/store'; // Import your Redux store
import './App.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  }, [setUser, setBalance]); // Don't forget to add navigate to the dependency array

  return (
    <Provider store={store}> {/* Wrap your app with Provider */}
        <Header />
        <Routes>
          <Route path="/" index element={user ? <Navigate to="/buy" /> : <WelcomePage />} />
          <Route path="/buy" element={<BuyStocks />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/loading" element={<LoadingPage />} />
        </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </Provider>
  );
};

export default App;
