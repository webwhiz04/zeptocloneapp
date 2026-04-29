import { useEffect, useState } from "react";
import { FaBox, FaClipboardList, FaUsers, FaRupeeSign } from "react-icons/fa";
import "./admin-dashboard.css";
import API_BASE_URL from "../services/api";

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/stats`);
                const data = await response.json();
                if (response.ok) {
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="admin-dashboard-content">
            <header className="admin-content-header">
                <h1>Welcome to Admin Dashboard</h1>
                <p className="admin-subtitle">ZEPTO CLONE</p>
            </header>

            <div className="admin-stats-grid">
                <div className="stat-card">
                    <div className="stat-icon products-icon">
                        <FaBox />
                    </div>
                    <div className="stat-details">
                        <h3>{stats.totalProducts}</h3>
                        <p>Total Products</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orders-icon">
                        <FaClipboardList />
                    </div>
                    <div className="stat-details">
                        <h3>{stats.totalOrders}</h3>
                        <p>Total Orders</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon users-icon">
                        <FaUsers />
                    </div>
                    <div className="stat-details">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon revenue-icon">
                        <FaRupeeSign />
                    </div>
                    <div className="stat-details">
                        <h3>₹{stats.totalRevenue.toFixed(2)}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
            </div>

            <div className="admin-charts-section">
                <div className="chart-container revenue-trend">
                    <h3>Revenue Trend</h3>
                    <div className="placeholder-chart">
                        {/* Placeholder for chart */}
                        <div className="bar-chart-mock">
                            <div className="bar" style={{height: '40%'}}></div>
                            <div className="bar" style={{height: '60%'}}></div>
                            <div className="bar" style={{height: '50%'}}></div>
                            <div className="bar" style={{height: '80%'}}></div>
                            <div className="bar" style={{height: '70%'}}></div>
                        </div>
                    </div>
                </div>
                <div className="chart-container order-status">
                    <h3>Order Status</h3>
                    <div className="placeholder-chart">
                        <div className="pie-chart-mock"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
