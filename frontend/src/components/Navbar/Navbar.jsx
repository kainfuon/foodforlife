import { useState } from 'react'
import { assets } from '../../assets/assets.js'
import './Navbar.css'
const Navbar = ({setShowLogin}) => {
    const [menu, setMenu] = useState("home")
    return (
        <div className='navbar'>
            <img src={assets.logo} alt="" className="logo" />
            <ul className="navbar-menu">
                <li onClick={() =>setMenu("home")} className={menu === "home" ? "active" : ""}>home</li>
                <li onClick={() =>setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</li>
                <li onClick={() =>setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</li>
                <li onClick={() =>setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</li>
            </ul>
            <div className='navbar-right'>
                <img src={assets.search_icon} alt="" />
                <div className="Navbar-search-icon">
                    <img src={assets.basket_icon} alt="" />
                    <div className="dot"></div>
                </div>
                <button onClick={()=>setShowLogin(true)}>sign in</button>
            </div>
        </div>
    )
}

export default Navbar