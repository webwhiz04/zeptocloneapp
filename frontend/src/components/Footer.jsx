import React from 'react';
import './Footer.css';
import { FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { getPlaceholderUrl } from '../utils/imageUrl';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footerhero">
                <div className="herocontent">
                    <h1>The place that fits all <br />your needs</h1>
                    <p>Crafted with love from <span className="highlight">Zepto Team ❤️</span></p>
                    <div className="fssaitop">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/FSSAI_logo.svg/1200px-FSSAI_logo.svg.png" alt="FSSAI" className="fssailogo" />
                        <span>LIC no - 11224999000872</span>
                    </div>
                </div>
            </div>

            <div className="howitworks">
                <div className="howitworkscontent">
                    <h2>How it Works</h2>
                    <div className="stepscontainer">
                        <div className="stepcard">
                            <img src={getPlaceholderUrl(80, 80, "App")} alt="Open the app" className="stepicon" />
                            <h3>Open the app</h3>
                            <p>Choose from over 7000 products across groceries, fresh fruits & veggies, meat, pet care, beauty items & more</p>
                        </div>
                        <div className="stepcard">
                            <img src={getPlaceholderUrl(80, 80, "Order")} alt="Place an order" className="stepicon" />
                            <h3>Place an order</h3>
                            <p>Add your favourite items to the cart & avail the best offers</p>
                        </div>
                        <div className="stepcard">
                            <img src={getPlaceholderUrl(80, 80, "Delivery")} alt="Get free delivery" className="stepicon" />
                            <h3>Get free delivery</h3>
                            <p>Experience lighting-fast speed & get all your items delivered in minutes</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="trendingsection">
                <div className="trendingcontent">
                    <h3>Trending Searches</h3>
                    <div className="searchgroup">
                        <strong>Categories :</strong>
                        <span className="searchlinks">
                            <span>Ice Creams</span> | <span>Fans & Coolers</span> | <span>Talcom Powder</span> | <span>Mosquito Nets</span> | <span>Sunscreen</span> | <span>Ice Cream Cake</span> | <span>Cold Beverages</span> | <span>Sunglasses</span>
                        </span>
                    </div>
                    <div className="searchgroup">
                        <strong>Products :</strong>
                        <span className="searchlinks">
                            <span>Bajaj Table Fan</span> | <span>OnePlus 13R</span> | <span>Nothing Phone 3a Lite</span> | <span>Mill'D High Protein Wheat Flour</span> | <span>Coconut Water</span> | <span>Diet Coke</span> | <span>Masala Chaas</span> | <span>Amul Rabdi</span> | <span>Lahori Jeera</span> | <span>Hocco Aamchi Ice Cream</span> | <span>Ice Cube</span>
                        </span>
                    </div>
                    <div className="searchgroup">
                        <strong>Brands :</strong>
                        <span className="searchlinks">
                            <span>Rasna</span> | <span>Dermi Cool</span> | <span>Decathlon</span> | <span>Kwality Walls</span> | <span>Vincent Chase By Lenskart</span>
                        </span>
                    </div>

                    <h3 style={{ marginTop: '40px' }}>Popular Searches</h3>
                    <div className="searchgroup">
                        <strong>Products :</strong>
                        <span className="searchlinks">
                            <span>Avocado</span> | <span>Strawberry</span> | <span>Pomegranate</span> | <span>Beetroot</span> | <span>Ash gourd</span> | <span>Bottle gourd</span> | <span>Lady finger</span> | <span>Potato</span> | <span>Lemon</span> | <span>Dalchini</span> | <span>Fennel seeds</span> | <span>Blueberry</span> | <span>Papaya</span> | <span>Jeera</span> | <span>Mushroom</span> | <span>Lettuce</span>
                        </span>
                    </div>
                    <div className="searchgroup">
                        <strong>Brands :</strong>
                        <span className="searchlinks">
                            <span>Yakult</span> | <span>My Muse</span> | <span>Aashirvaad Atta</span> | <span>Too Yumm</span> | <span>Lays</span> | <span>Figaro Olive Oil</span> | <span>Nandini Milk</span> | <span>Amul</span> | <span>Mother Dairy Near Me</span> | <span>Fortune Oil</span> | <span>Superyou</span> | <span>Durex Condoms</span> | <span>Ferns and Petals</span>
                        </span>
                    </div>
                    <div className="searchgroup">
                        <strong>Categories :</strong>
                        <span className="searchlinks">
                            <span>Grocery</span> | <span>Cigarettes</span> | <span>Chips</span> | <span>Curd</span> | <span>Hukka flavour</span> | <span>Paan shop near me</span> | <span>Eggs price</span> | <span>Cheese slice</span> | <span>Fresh fruits</span> | <span>Fresh vegetables</span> | <span>Refined oil</span> | <span>Butter price</span> | <span>Paneer price</span>
                        </span>
                    </div>
                 </div>
             </div>

             <div className="categoriessection">
                 <div className="categoriescontent">
                     <h3>Categories</h3>
                     <div className="categoriesgrid">
                         <div className="catcolumn">
                             <h4>Fruits & Vegetables</h4>
                             <h4>Baby Food</h4>
                             <h4>Breakfast & Sauces</h4>
                             <h4>Cleaning Essentials</h4>
                             <h4>Homegrown Brands</h4>
                         </div>
                         <div className="catcolumn">
                             <h4>Atta, Rice, Oil & Dals</h4>
                             <h4>Dairy, Bread & Eggs</h4>
                             <h4>Tea, Coffee & More</h4>
                             <h4>Home Needs</h4>
                             <h4>Paan Corner</h4>
                         </div>
                         <div className="catcolumn">
                             <h4>Masala & Dry Fruits</h4>
                             <h4>Cold Drinks & Juices</h4>
                             <h4>Biscuits</h4>
                             <h4>Electricals & Accessories</h4>
                         </div>
                         <div className="catcolumn">
                             <h4>Sweet Cravings</h4>
                             <h4>Munchies</h4>
                             <h4>Makeup & Beauty</h4>
                             <h4>Hygiene & Grooming</h4>
                         </div>
                         <div className="catcolumn">
                             <h4>Frozen Food & Ice Creams</h4>
                             <h4>Meats, Fish & Eggs</h4>
                             <h4>Bath & Body</h4>
                             <h4>Health & Baby Care</h4>
                         </div>
                     </div>
                 </div>
             </div>

             <div className="footerbottom">
                 <div className="footerbottomcontent">
                     <div className="footerbrand">
                         <span className="logo">zepto</span>
                         <div className="socialicons">
                             <FaInstagram />
                             <FaXTwitter />
                             <FaFacebookF />
                             <FaLinkedinIn />
                         </div>
                         <p className="copyright">© Zepto Marketplace Private Limited</p>
                         <p className="copyright">fssai lic no : 11224999000872</p>
                     </div>

                     <div className="footerlinksgroup">
                         <div className="linkcol">
                             <ul>
                                 <li>Home</li>
                                 <li>Delivery Areas</li>
                                 <li>Careers</li>
                                 <li>Customer Support</li>
                                 <li>Press</li>
                                 <li>Mojo - a Zepto Blog</li>
                                 <li>Zepto Recipes</li>
                             </ul>
                         </div>
                         <div className="linkcol">
                             <ul>
                                 <li>Privacy Policy</li>
                                 <li>Terms of Use</li>
                                 <li>Responsible Disclosure Policy</li>
                                 <li>Sell on Zepto</li>
                                 <li>Deliver with Zepto</li>
                                 <li>Franchise with Zepto</li>
                             </ul>
                         </div>
                     </div>

                     <div className="appdownload">
                         <h4>Download App</h4>
                         <div className="appbtns">
                             <a href="#" className="appbtn">
                                 <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" />
                                 <span>Get it on play store</span>
                             </a>
                             <a href="#" className="appbtn">
                                 <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" />
                                 <span>Get it on app store</span>
                             </a>
                         </div>
                     </div>
                 </div>
             </div>
         </footer>
     );
 };

export default Footer;
