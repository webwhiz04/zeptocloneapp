import { Link } from "react-router-dom";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const categoryLinks = [
    "Ice Creams", "Fans & Coolers", "Talcom Powder", "Mosquito Nets",
    "Sunscreen", "Ice Cream Cake", "Cold Beverages", "Sunglasses"
  ];

  const productLinks = [
    "Bajaj Table Fan", "OnePlus 13R", "Nothing Phone 3a Lite",
    "Mill'D High Protein Wheat Flour", "Coconut Water", "Diet Coke",
    "Masala Chaas", "Amul Rabdi", "Lahori Jeera", "Hocco Aamchi Ice Cream",
    "Ice Cube"
  ];

  const brandLinks = [
    "Rasna", "Dermi Cool", "Decathlon", "Kwality Walls",
    "Vincent Chase By Lenskart"
  ];

  const popularSearchProducts = [
    "Avocado", "Strawberry", "Pomegranate", "Beetroot", "Ash gourd",
    "Bottle gourd", "Lady finger", "Potato", "Lemon", "Dalchini",
    "Fennel seeds", "Blueberry", "Papaya", "Jeera", "Mushroom", "Lettuce"
  ];

  const popularSearchBrands = [
    "Yakult", "My Muse", "Aashirvaad Atta", "Too Yumm", "Lays",
    "Figaro Olive Oil", "Nandini Milk", "Amul", "Mother Dairy",
    "Fortune Oil", "Superyou", "Durex Condoms", "Ferns and Petals"
  ];

  const mainCategories = [
    "Fruits & Vegetables", "Atta, Rice, Oil & Dals", "Masala & Dry Fruits",
    "Sweet Cravings", "Frozen Food & Ice Creams", "Baby Food",
    "Dairy, Bread & Eggs", "Cold Drinks & Juices", "Munchies",
    "Meats, Fish & Eggs", "Breakfast & Sauces", "Tea, Coffee & More",
    "Biscuits", "Makeup & Beauty", "Bath & Body", "Cleaning Essentials",
    "Home Needs", "Electricals & Accessories", "Hygiene & Grooming",
    "Health & Baby Care", "Homegrown Brands", "Paan Corner"
  ];

  return (
    <footer className="footer">
      <div className="footerContainer">
        <div className="howItWorks">
          <div className="howItWorksSection">
            <h3>Open the app</h3>
            <p>Choose from over 7000 products across groceries, fresh fruits & veggies, meat, pet care, beauty items & more</p>
          </div>
          <div className="howItWorksSection">
            <h3>Place an order</h3>
            <p>Add your favourite items to the cart & avail the best offers</p>
          </div>
          <div className="howItWorksSection">
            <h3>Get free delivery</h3>
            <p>Experience lighting-fast speed & get all your items delivered in minutes</p>
          </div>
        </div>

        <div className="trendingSearches">
          <h4>Trending Searches</h4>

          <div className="searchCategory">
            <strong>Categories:</strong>
            <p>{categoryLinks.join(" | ")}</p>
          </div>

          <div className="searchCategory">
            <strong>Products:</strong>
            <p>{productLinks.join(" | ")}</p>
          </div>

          <div className="searchCategory">
            <strong>Brands:</strong>
            <p>{brandLinks.join(" | ")}</p>
          </div>
        </div>

        <div className="popularSearches">
          <h4>Popular Searches</h4>

          <div className="searchCategory">
            <strong>Products:</strong>
            <p>{popularSearchProducts.join(" | ")}</p>
          </div>

          <div className="searchCategory">
            <strong>Brands:</strong>
            <p>{popularSearchBrands.join(" | ")}</p>
          </div>

          <div className="searchCategory">
            <strong>Categories:</strong>
            <p>Grocery | Cigarettes | Chips | Curd | Hukka flavour | Paan shop | Eggs price | Cheese slice | Fresh fruits | Fresh vegetables | Refined oil | Butter price | Paneer price</p>
          </div>
        </div>

        <div className="allCategories">
          <h4>Categories</h4>
          <div className="categoriesGrid">
            {mainCategories.map((category, index) => (
              <Link key={index} to="#" className="categoryLink">
                {category}
              </Link>
            ))}
          </div>
        </div>

        <div className="footerDivider"></div>

        <div className="footerBottom">
          <div className="footerLinks">
            <Link to="#">Home</Link>
            <Link to="#">Delivery Areas</Link>
            <Link to="#">Careers</Link>
            <Link to="#">Customer Support</Link>
            <Link to="#">Press</Link>
            <Link to="#">Mojo - a Zepto Blog</Link>
            <Link to="#">Zepto Recipes</Link>
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Use</Link>
            <Link to="#">Responsible Disclosure Policy</Link>
            <Link to="#">Sell on Zepto</Link>
            <Link to="#">Deliver with Zepto</Link>
            <Link to="#">Franchise with Zepto</Link>
          </div>

          <div className="appDownload">
            <h5>Download App</h5>
            <div className="appButtons">
              <a href="#" className="appButton playStore">
                <FaGooglePlay /> Get it on Play Store
              </a>
              <a href="#" className="appButton appStore">
                <FaApple /> Get it on App Store
              </a>
            </div>
          </div>

          <div className="footerCopyright">
            <p>&copy; Zepto Marketplace Private Limited</p>
            <p>FSSAI LIC NO: 11224999000872</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
