import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPlus, FaBox, FaClipboardList } from "react-icons/fa";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        document.body.classList.add("admin-mode");

        return () => {
            document.body.classList.remove("admin-mode");
        };
    }, []);

    const menuItems = [
        { path: "/admindashboard/addproduct", label: "Add Product", icon: <FaPlus /> },
        { path: "/admindashboard/viewproduct", label: "Manage Product", icon: <FaBox /> },
        { path: "/admindashboard/user", label: "Manage Order", icon: <FaClipboardList /> },
    ];

    return (
        <div className="adminLayout">
            <div className="adminContainer">
                <aside className="adminSidebar">
                    <div className="adminSidebarHeader">
                        <Link to="/admindashboard" className="adminLogoLink">
                            <img src="/logo.svg" alt="Zepto Logo" className="adminZeptoLogo" />
                            <span className="logoTextAdmin">Admin</span>
                        </Link>
                    </div>
                    <nav className="adminNav">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`adminNavItem ${location.pathname === item.path ? "active" : ""}`}
                            >
                                <span className="adminNavIcon">{item.icon}</span>
                                <span className="adminNavLabel">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>
                <main className="adminMain">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
