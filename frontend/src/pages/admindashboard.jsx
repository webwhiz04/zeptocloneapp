import { useEffect, useState } from "react";
import { FaBox, FaClipboardList, FaUsers, FaRupeeSign } from "react-icons/fa";
import "./admin-dashboard.css";
import API_BASE_URL from "../services/api";

const STATUS_ORDER = ["Placed", "Processing", "Shipped", "Out for delivery"];
const STATUS_COLORS = {
    "Placed": "#1e88e5",
    "Processing": "#fb8c00",
    "Shipped": "#8e24aa",
    "Out for delivery": "#43a047",
};

const formatRevenueLabel = (value) => `₹${Number(value || 0).toFixed(0)}`;

const getLineChartPoints = (trend = [], width = 560, height = 260, padding = 42) => {
    const maxRevenue = Math.max(...trend.map((item) => Number(item.revenue || 0)), 0);
    const safeMax = maxRevenue === 0 ? 1 : maxRevenue;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;

    const points = trend.map((item, index) => {
        const x = padding + (trend.length <= 1 ? 0 : (index / (trend.length - 1)) * innerWidth);
        const y = padding + (1 - Number(item.revenue || 0) / safeMax) * innerHeight;
        return { x, y, label: item.label, revenue: Number(item.revenue || 0) };
    });

    return {
        points,
        maxRevenue: safeMax,
        width,
        height,
        padding,
        innerHeight,
    };
};

const getPieSegments = (statusBreakdown = {}) => {
    const values = STATUS_ORDER.map((status) => Number(statusBreakdown[status] || 0));
    const total = values.reduce((sum, value) => sum + value, 0);

    if (total === 0) {
        return {
            conicStops: "#e7ebf0 0deg 360deg",
            total,
            items: STATUS_ORDER.map((status) => ({ status, value: 0, percentage: 0 })),
        };
    }

    let start = 0;
    const conicParts = [];
    const items = STATUS_ORDER.map((status, index) => {
        const value = values[index];
        const angle = (value / total) * 360;
        const end = start + angle;
        conicParts.push(`${STATUS_COLORS[status]} ${start.toFixed(2)}deg ${end.toFixed(2)}deg`);
        const item = {
            status,
            value,
            percentage: (value / total) * 100,
        };
        start = end;
        return item;
    });

    return {
        conicStops: conicParts.join(", "),
        total,
        items,
    };
};

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        revenueTrend: [],
        statusBreakdown: {
            Placed: 0,
            Processing: 0,
            Shipped: 0,
            "Out for delivery": 0,
        },
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

    const chartData = getLineChartPoints(stats.revenueTrend, 560, 260, 42);
    const linePath = chartData.points
        .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
        .join(" ");
    const yAxisTicks = [1, 0.5, 0].map((ratio) => {
        const value = chartData.maxRevenue * ratio;
        const y = chartData.padding + (1 - ratio) * chartData.innerHeight;
        return { value, y };
    });

    const pieData = getPieSegments(stats.statusBreakdown);

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
                    <h3>Revenue Trend (Last 1 Month)</h3>
                    <div className="placeholder-chart">
                        <div className="line-chart-wrap">
                            <div className="chart-y-label">Y Axis: Revenue (INR)</div>
                            <svg viewBox="0 0 560 260" className="line-chart-svg" role="img" aria-label="Revenue chart with x and y axis">
                                <line x1="42" y1="218" x2="528" y2="218" className="chart-axis" />
                                <line x1="42" y1="42" x2="42" y2="218" className="chart-axis" />

                                {yAxisTicks.map((tick) => (
                                    <g key={tick.y}>
                                        <line x1="42" y1={tick.y} x2="528" y2={tick.y} className="chart-grid" />
                                        <text x="8" y={tick.y + 4} className="chart-tick-label">{formatRevenueLabel(tick.value)}</text>
                                    </g>
                                ))}

                                {linePath ? <path d={linePath} className="chart-line" /> : null}

                                {chartData.points.map((point) => (
                                    <g key={`${point.label}-${point.x}`}>
                                        <circle cx={point.x} cy={point.y} r="4" className="chart-dot" />
                                        <text x={point.x} y="236" textAnchor="middle" className="chart-tick-label">
                                            {point.label}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                            <div className="chart-x-label">X Axis: Date</div>
                        </div>
                    </div>
                </div>
                <div className="chart-container order-status">
                    <h3>Order Status Distribution</h3>
                    <div className="placeholder-chart">
                        <div className="status-pie-wrap">
                            <div
                                className="pie-chart-live"
                                style={{ background: `conic-gradient(${pieData.conicStops})` }}
                                role="img"
                                aria-label="Pie chart for placed processing shipped out for delivery"
                            >
                                <span className="pie-total">{pieData.total}</span>
                            </div>
                            <div className="pie-legend">
                                {pieData.items.map((item) => (
                                    <div key={item.status} className="legend-row">
                                        <span className="legend-dot" style={{ backgroundColor: STATUS_COLORS[item.status] }}></span>
                                        <span className="legend-label">{item.status}</span>
                                        <span className="legend-value">{item.value} ({item.percentage.toFixed(0)}%)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
