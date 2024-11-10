import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import StoreContextProvider from './context/StoreContext'; // Import Provider
import Cart from './pages/Cart/Cart';
import Home from './pages/Home/Home';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import { useState } from 'react';
import Verify from './pages/Verify/Verify';

const App = () => {

  const [showLogin, setShowLogin] = useState(true)


  return (
    <StoreContextProvider>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<PlaceOrder />} />
          <Route path='verify' element={<Verify/>}/>
        </Routes>
      </div>
      <Footer></Footer>
    </StoreContextProvider>
  );
};

export default App;
