import { useEffect, useMemo, useState } from "react";
import getImageUrl from "../utils/imageUrl.js";
import "./adminuserorders.css";

import { API_URLS } from "../services/api";

const API_URL = `${API_URLS.USERDATA}/admin/orders`;
const STATUS_OPTIONS = ["Placed", "Processing", "Shipped", "Out for delivery", "Delivered"];

const formatMoney = (value) => `Rs ${Number(value || 0).toFixed(2)}`;

const formatDateTime = (value) => {
    const date = value ? new Date(value) : null;

    if (!date || Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

const formatAddressLines = (shippingAddress = {}) => {
    return [
        shippingAddress.name,
        shippingAddress.phone,
        shippingAddress.address,
        [shippingAddress.city, shippingAddress.postalCode].filter(Boolean).join(" "),
        shippingAddress.country,
    ]
        .map((value) => String(value || "").trim())
        .filter(Boolean);
};

const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : { message: await response.text() };

    if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
};

function AdminUserOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [updatingKey, setUpdatingKey] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState({});

    const loadOrders = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch(API_URL);
            const data = await parseResponse(response);
            const nextOrders = Array.isArray(data.orders) ? data.orders : [];
            setOrders(nextOrders);
            setSelectedStatuses((previous) => {
                const next = { ...previous };
                nextOrders.forEach((order) => {
                    const orderKey = String(order.orderKey || order.paymentDetails?.paymentId || order.paymentDetails?.orderId || order.orderedAt || "");
                    next[orderKey] = next[orderKey] || order.status || "Placed";
                });
                return next;
            });
        } catch (error) {
            console.error("Load admin orders error:", error);
            setErrorMessage(error.message || "Unable to load user orders");
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const groupedOrders = useMemo(() => {
        return [...orders].sort((left, right) => {
            const leftTime = new Date(left.orderedAt || left.paymentDetails?.paidAt || 0).getTime();
            const rightTime = new Date(right.orderedAt || right.paymentDetails?.paidAt || 0).getTime();
            return rightTime - leftTime;
        });
    }, [orders]);

    const handleStatusChange = (orderKey, value) => {
        setSelectedStatuses((previous) => ({
            ...previous,
            [orderKey]: value,
        }));
    };

    const handleUpdateStatus = async (order) => {
        const orderKey = String(order.orderKey || order.paymentDetails?.paymentId || order.paymentDetails?.orderId || order.orderedAt || "");
        const status = selectedStatuses[orderKey] || order.status || "Placed";

        setUpdatingKey(orderKey);
        setErrorMessage("");

        try {
            const response = await fetch(`${API_URLS.USERDATA}/admin/orders/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: order.userEmail,
                    orderKey,
                    status,
                }),
            });

            await parseResponse(response);
            await loadOrders();
        } catch (error) {
            console.error("Update order status error:", error);
            setErrorMessage(error.message || "Unable to update order status");
        } finally {
            setUpdatingKey("");
        }
    };

    return (
        <div className="adminOrdersContainer">
            <header className="adminContentHeader">
                <h1>User Orders</h1>
                <button type="button" className="refreshBtn" onClick={loadOrders}>
                    Refresh
                </button>
            </header>

            {errorMessage ? <p className="adminError">{errorMessage}</p> : null}

            {isLoading ? (
                <div className="adminLoadingCard">Loading user orders...</div>
            ) : groupedOrders.length === 0 ? (
                <div className="adminEmptyCard">No orders available.</div>
            ) : (
                <div className="ordersTableCard">
                    <div className="tableWrap">
                        <table className="adminOrdersTable">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Ordered At</th>
                                    <th>Shipping</th>
                                    <th>Products</th>
                                    <th>Payment</th>
                                    <th>Total</th>
                                    <th>Current Status</th>
                                    <th>Update Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedOrders.map((order) => {
                                    const orderKey = String(order.orderKey || order.paymentDetails?.paymentId || order.paymentDetails?.orderId || order.orderedAt || "");
                                    const status = selectedStatuses[orderKey] || order.status || "Placed";
                                    const items = Array.isArray(order.items) ? order.items : [];
                                    const addressLines = formatAddressLines(order.shippingAddress || {});

                                    return (
                                        <tr key={`${order.userEmail}-${orderKey}`}>
                                            <td className="userCell">
                                                <div className="cellStack">
                                                    <span className="orderEmail">{order.userEmail}</span>
                                                    <span className="orderKey">ID: {orderKey || "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="dateCell">
                                                <span className="cellMeta">{formatDateTime(order.orderedAt || order.paymentDetails?.paidAt)}</span>
                                            </td>
                                            <td className="addressCell">
                                                <div className="addressStack">
                                                    {addressLines.map((line) => (
                                                        <p key={line}>{line}</p>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="productsCell">
                                                <div className="productsList">
                                                    {items.map((item, index) => (
                                                        <div className="productRow" key={`${item.productId}-${index}`}>
                                                            <img src={getImageUrl(item.image)} alt={item.name} />
                                                            <span className="productNameMini">{item.name} x {item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="paymentCell">
                                                <div className="cellStack">
                                                    <span className="methodTag">{order.paymentDetails?.method || "COD"}</span>
                                                    <span className="paymentId">{order.paymentDetails?.paymentId || "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="totalCell">
                                                <strong className="totalAmount">{formatMoney(order.totalAmount)}</strong>
                                            </td>
                                            <td className="statusCell">
                                                <span className={`status-badge ${order.status?.toLowerCase()}`}>{order.status || "Placed"}</span>
                                            </td>
                                            <td className="actionCell">
                                                <div className="statusActions">
                                                    <select
                                                        value={status}
                                                        onChange={(e) => handleStatusChange(orderKey, e.target.value)}
                                                        disabled={updatingKey === orderKey}
                                                    >
                                                        {STATUS_OPTIONS.map((opt) => (
                                                            <option key={opt} value={opt}>
                                                                {opt}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        className="saveStatusBtn"
                                                        onClick={() => handleUpdateStatus(order)}
                                                        disabled={updatingKey === orderKey}
                                                    >
                                                        {updatingKey === orderKey ? "Saving..." : "Save"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUserOrders;
