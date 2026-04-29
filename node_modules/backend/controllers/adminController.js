import Product from "../models/Product.js";
import User from "../models/User.js";

export const getAdminStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        
        // Fetch all users to calculate orders and revenue accurately
        const allUsers = await User.find({}).select("orders");
        
        let totalOrders = 0;
        let totalRevenue = 0;

        allUsers.forEach(user => {
            if (Array.isArray(user.orders)) {
                totalOrders += user.orders.length;
                user.orders.forEach(order => {
                    totalRevenue += (order.totalAmount || 0);
                });
            }
        });

        return res.status(200).json({
            stats: {
                totalProducts,
                totalOrders,
                totalUsers,
                totalRevenue
            }
        });
    } catch (error) {
        console.error("Fetch Admin Stats Error:", error);
        return res.status(500).json({ message: "Server error while fetching admin stats" });
    }
};
