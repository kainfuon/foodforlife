import './Footer.css'
import { assets } from './../../assets/assets';
const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img id='i' src={assets.ac} alt="" />
                    <p>Righit sth right here</p>
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
            <p className="footer-copyright">Right sth right here</p>
        </div>
    )
}

export default Footer