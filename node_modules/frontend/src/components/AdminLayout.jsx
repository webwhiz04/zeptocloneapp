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
        <div className="admin-layout">
            <div className="admin-container">
                <aside className="admin-sidebar">
                    <div className="admin-sidebar-header">
                        <Link to="/admindashboard" className="admin-logo-link">
                            <img src="/logo.svg" alt="Zepto Logo" className="admin-zepto-logo" />
                            <span className="logo-text-admin">Admin</span>
                        </Link>
                    </div>
                    <nav className="admin-nav">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`admin-nav-item ${location.pathname === item.path ? "active" : ""}`}
                            >
                                <span className="admin-nav-icon">{item.icon}</span>
                                <span className="admin-nav-label">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>
                <main className="admin-main">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
