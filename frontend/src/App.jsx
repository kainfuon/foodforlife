import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import StoreContextProvider from './context/StoreContext'; // Import Provider
import Cart from './pages/Cart/Cart';
import Home from './pages/Home/Home';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
const App = () => {
  return (
    <StoreContextProvider>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<PlaceOrder />} />
        </Routes>
      </div>
      <Footer></Footer>
    </StoreContextProvider>
  );
};

export default App;
