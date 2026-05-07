import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { BsBagHeart } from "react-icons/bs";
import { SiBuymeacoffee } from "react-icons/si";
import { FaHome } from "react-icons/fa";
import { TbHorseToy } from "react-icons/tb";
import { SiCodefresh } from "react-icons/si";
import { FaHeadphonesAlt } from "react-icons/fa";
import { CiMobile3 } from "react-icons/ci";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { GiLargeDress } from "react-icons/gi";
import { IoIosSearch } from "react-icons/io";
import { TfiLocationPin } from "react-icons/tfi";
import "../styles/nav.css";
import {
    clearLoggedInUser,
    getLoggedInEmail,
    getLoggedInUserDetails,
    isUserLoggedIn,
} from "../utils/authStorage.js";
function Nav() {
    const navigate = useNavigate();
    const loggedIn = isUserLoggedIn();
    const email = getLoggedInEmail();
    const userDetails = getLoggedInUserDetails();
    const displayEmail = userDetails?.email || email;
    const userName = displayEmail ? displayEmail.split("@")[0] : "User";
    const [showUserPopup, setShowUserPopup] = useState(false);
    const userAreaRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (userAreaRef.current && !userAreaRef.current.contains(event.target)) {
                setShowUserPopup(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleUserIconClick = () => {
        setShowUserPopup((prev) => !prev);
    };

    const handleLogout = () => {
        clearLoggedInUser();
        setShowUserPopup(false);
        navigate("/login", { replace: true });
    };

    return (
        <div className="nav-container">
            <header className="navbar">
                <div className="leftnav">
                    <Link to="/" className="logo-area">
                        <img
                            src="https://cdn.zeptonow.com/web-static-assets-prod/artifacts/14.12.1/images/header/primary-logo.svg"
                            alt="Zepto logo"
                        />
                    </Link>
                    <div className="loc"><TfiLocationPin />Select Location <span className="arrow">⌵</span></div>
                </div>

                <div className="centernav">
                    <div className="search-wrapper">
                        <div className="icon"><IoIosSearch /></div>
                        <input type="text" placeholder='Search for "apple juice"' className="searchinput"/>
                    </div>
                </div>

                <div className="rightnav">
                    {loggedIn ? (
                        <div className="user-area" ref={userAreaRef}>
                            <button type="button" className="user-trigger" onClick={handleUserIconClick}>
                                <div className="nav-icon-wrap">
                                    <FaUserCircle />
                                    <span>Profile</span>
                                </div>
                            </button>
                            {showUserPopup && (
                                <div className="user-popup" role="menu" aria-label="User menu">
                                    <div className="popup-user-name"><FaUserCircle /> {userName}</div>
                                    <div className="popup-orders" role="menuitem" onClick={() => { navigate("/my-orders"); setShowUserPopup(false); }}>
                                        My Orders
                                    </div>
                                    <div className="popup-info" role="menuitem" onClick={() => { navigate("/profile"); setShowUserPopup(false); }}>
                                        My Profile
                                    </div>
                                    <button type="button" className="logout-btn" onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="login-link">
                            <div className="nav-icon-wrap">
                                <FaUserCircle />
                                <span>Login</span>
                            </div>
                        </Link>
                    )}

                    <Link to="/cart" className="cart-link">
                        <div className="nav-icon-wrap">
                            <FaShoppingCart />
                            <span>Cart</span>
                        </div>
                    </Link>

                    <Link to="/admin" className="admin-link">
                        <div className="nav-icon-wrap">
                            <RiAdminFill />
                            <span>Admin</span>
                        </div>
                    </Link>
                </div>
            </header>

            <nav className="category-bar">
                <Link to="/all" className="cat-item active"><BsBagHeart className="cat-icon" /> All</Link>
                <Link to="/cafe" className="cat-item"><SiBuymeacoffee className="cat-icon" /> Cafe</Link>
                <Link to="/home" className="cat-item"><FaHome className="cat-icon" /> Home</Link>
                <Link to="/toys" className="cat-item"><TbHorseToy className="cat-icon" /> Toys</Link>
                <Link to="/fresh" className="cat-item"><SiCodefresh className="cat-icon" /> Fresh</Link>
                <Link to="/electronics" className="cat-item"><FaHeadphonesAlt className="cat-icon" /> Electronics</Link>
                <Link to="/mobile" className="cat-item"><CiMobile3 className="cat-icon" /> Mobiles</Link>
                <Link to="/beauty" className="cat-item"><FaWandMagicSparkles className="cat-icon" /> Beauty</Link>
                <Link to="/fashion" className="cat-item"><GiLargeDress className="cat-icon" /> Fashion</Link>
            </nav>
        </div>
    );
}

export default Nav;
