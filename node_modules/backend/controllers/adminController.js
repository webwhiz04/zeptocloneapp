import Product from "../models/Product.js";
import User from "../models/User.js";

const STATUS_KEYS = {
    placed: "Placed",
    processing: "Processing",
    shipped: "Shipped",
    out_for_delivery: "Out for delivery",
};

const normalizeStatus = (value) => {
    const normalized = String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

    if (normalized === "out for delivery") {
        return STATUS_KEYS.out_for_delivery;
    }

    if (normalized === "placed") {
        return STATUS_KEYS.placed;
    }

    if (normalized === "processing") {
        return STATUS_KEYS.processing;
    }

    if (normalized === "shipped") {
        return STATUS_KEYS.shipped;
    }

    return "";
};

const getDateLabel = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
    }).format(date);
};

const getLastNDaysBuckets = (days = 7) => {
    const buckets = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let offset = days - 1; offset >= 0; offset -= 1) {
        const date = new Date(now);
        date.setDate(now.getDate() - offset);
        const key = date.toISOString().slice(0, 10);
        buckets.push({ key, label: getDateLabel(date), value: 0 });
    }

    return buckets;
};

export const getAdminStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        
        // Fetch all users to calculate orders and revenue accurately
        const allUsers = await User.find({}).select("orders");
        
        let totalOrders = 0;
        let totalRevenue = 0;
        const revenueBuckets = getLastNDaysBuckets(30);
        const revenueByDate = Object.fromEntries(revenueBuckets.map((bucket) => [bucket.key, bucket]));
        const statusBreakdown = {
            [STATUS_KEYS.placed]: 0,
            [STATUS_KEYS.processing]: 0,
            [STATUS_KEYS.shipped]: 0,
            [STATUS_KEYS.out_for_delivery]: 0,
        };

        allUsers.forEach(user => {
            if (Array.isArray(user.orders)) {
                totalOrders += user.orders.length;
                user.orders.forEach(order => {
                    totalRevenue += (order.totalAmount || 0);

                    const orderDate = new Date(order.orderedAt || order.paymentDetails?.paidAt || Date.now());
                    const orderDateKey = Number.isNaN(orderDate.getTime())
                        ? ""
                        : orderDate.toISOString().slice(0, 10);

                    if (orderDateKey && revenueByDate[orderDateKey]) {
                        revenueByDate[orderDateKey].value += Number(order.totalAmount || 0);
                    }

                    const normalizedStatus = normalizeStatus(order.status);
                    if (normalizedStatus) {
                        statusBreakdown[normalizedStatus] += 1;
                    }
                });
            }
        });

        return res.status(200).json({
            stats: {
                totalProducts,
                totalOrders,
                totalUsers,
                totalRevenue,
                revenueTrend: revenueBuckets.map((bucket) => ({
                    label: bucket.label,
                    revenue: Number(bucket.value.toFixed(2)),
                })),
                statusBreakdown,
            }
        });
    } catch (error) {
        console.error("Fetch Admin Stats Error:", error);
        return res.status(500).json({ message: "Server error while fetching admin stats" });
    }
};
