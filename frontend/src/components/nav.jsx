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
        <div className="navContainer">
            <header className="navbar">
                <div className="leftnav">
                    <Link to="/" className="logoArea">
                        <img
                            src="https://cdn.zeptonow.com/web-static-assets-prod/artifacts/14.12.1/images/header/primary-logo.svg"
                            alt="Zepto logo"
                        />
                    </Link>
                    <div className="loc"><TfiLocationPin />Select Location <span className="arrow">⌵</span></div>
                </div>

                <div className="centernav">
                    <div className="searchWrapper">
                        <div className="icon"><IoIosSearch /></div>
                        <input type="text" placeholder='Search for "apple juice"' className="searchinput"/>
                    </div>
                </div>

                <div className="rightnav">
                    {loggedIn ? (
                        <div className="userArea" ref={userAreaRef}>
                            <button type="button" className="userTrigger" onClick={handleUserIconClick}>
                                <div className="navIconWrap">
                                    <FaUserCircle />
                                    <span>Profile</span>
                                </div>
                            </button>
                            {showUserPopup && (
                                <div className="userPopup" role="menu" aria-label="User menu">
                                    <div className="popupUserName"><FaUserCircle /> {userName}</div>
                                    <div className="popupOrders" role="menuitem" onClick={() => { navigate("/my-orders"); setShowUserPopup(false); }}>
                                        My Orders
                                    </div>
                                    <div className="popupInfo" role="menuitem" onClick={() => { navigate("/profile"); setShowUserPopup(false); }}>
                                        My Profile
                                    </div>
                                    <button type="button" className="logoutBtn" onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="loginLink">
                            <div className="navIconWrap">
                                <FaUserCircle />
                                <span>Login</span>
                            </div>
                        </Link>
                    )}

                    <Link to="/cart" className="cartLink">
                        <div className="navIconWrap">
                            <FaShoppingCart />
                            <span>Cart</span>
                        </div>
                    </Link>

                    <Link to="/admin" className="adminLink">
                        <div className="navIconWrap">
                            <RiAdminFill />
                            <span>Admin</span>
                        </div>
                    </Link>
                </div>
            </header>

            <nav className="categoryBar">
                <Link to="/all" className="catItem active"><BsBagHeart className="catIcon" /> All</Link>
                <Link to="/cafe" className="catItem"><SiBuymeacoffee className="catIcon" /> Cafe</Link>
                <Link to="/home" className="catItem"><FaHome className="catIcon" /> Home</Link>
                <Link to="/toys" className="catItem"><TbHorseToy className="catIcon" /> Toys</Link>
                <Link to="/fresh" className="catItem"><SiCodefresh className="catIcon" /> Fresh</Link>
                <Link to="/electronics" className="catItem"><FaHeadphonesAlt className="catIcon" /> Electronics</Link>
                <Link to="/mobile" className="catItem"><CiMobile3 className="catIcon" /> Mobiles</Link>
                <Link to="/beauty" className="catItem"><FaWandMagicSparkles className="catIcon" /> Beauty</Link>
                <Link to="/fashion" className="catItem"><GiLargeDress className="catIcon" /> Fashion</Link>
            </nav>
        </div>
    );
}

export default Nav;
