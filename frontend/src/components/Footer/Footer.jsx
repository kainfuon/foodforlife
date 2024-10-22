import './Footer.css'
import { assets } from './../../assets/assets';
const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src="/Itsuki.png" alt="AC Image" />
                    <p>
                        At <strong>Food For Live</strong>, your health and satisfaction come first.
                        Our meals are crafted to balance flavor and nutrition, helping you enjoy meaningful moments around the table.
                        <em>Order today and taste the difference!</em>
                    </p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />

                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET TIN TOUCH</h2>
                    <ul>
                        <li>+84-123-567-89</li>
                        <li>contact@.com</li>

                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">© 2024 Food For Live. All rights reserved.</p>
        </div>
    )
}

export default Footer