import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddProduct from "./addproduct.jsx";
import getImageUrl from "../utils/imageUrl.js";
import "./view.css";

import API_BASE_URL from "../services/api";

const BASE_URL = API_BASE_URL;
const API_URL = `${BASE_URL}/api/products`;

const callApi = (path = "", options = {}) => fetch(`${API_URL}${path}`, options);

const getDisplayValue = (value) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string" && value.trim() === "") return "-";
    return value;
};

function ViewProduct() {
    const [products, setProducts] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState("");
    const [editProduct, setEditProduct] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await callApi();
                const data = await response.json();

                if (!response.ok) {
                    setProducts([]);
                    setMessage(data?.message || "Unable to load products");
                    return;
                }

                setProducts(Array.isArray(data?.products) ? data.products : []);
                setMessage("");
            } catch (error) {
                setProducts([]);
                setMessage("Cannot connect to server. Please start backend.");
            }
        };

        fetchProducts();
    }, []);

    const goBack = () => navigate("/admindashboard");

    const startEdit = (product) => {
        setIsEdit(true);
        setEditId(product?._id || "");
        setEditProduct(product || null);
        setMessage("");
    };

    const cancelEdit = () => {
        setIsEdit(false);
        setEditId("");
        setEditProduct(null);
    };

    const removeProduct = async (id) => {
        try {
            const response = await callApi(`/${id}`, {
                method: "DELETE",
            });

            const text = await response.text();
            let data = {};
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = { message: text || "Server error while deleting product" };
            }

            if (!response.ok) {
                setMessage(data.message || "Server error while deleting product");
                return;
            }

            setProducts((prev) => prev.filter((item) => item._id !== id));
            if (editId === id) {
                setIsEdit(false);
                setEditId("");
                setEditProduct(null);
            }
            setMessage("Product removed");
        } catch (error) {
            setMessage(error?.message || "Server error while deleting product");
        }
    };

    const onEditSuccess = (updatedProduct) => {
        setProducts((prev) => prev.map((item) => (item._id === updatedProduct._id ? updatedProduct : item)));
        setIsEdit(false);
        setEditId("");
        setEditProduct(null);
        setMessage("Product updated");
    };

    return (
        <div className="view-product-container">
            {isEdit ? (
                <AddProduct
                    isEdit={isEdit}
                    editId={editId}
                    initialProduct={editProduct}
                    onSuccess={onEditSuccess}
                    onCancel={cancelEdit}
                    embedded
                />
            ) : (
                <div className="view-table-section">
                    <div className="viewheader">
                        <h2>Manage Products</h2>
                        <div className="view-actions">
                            <span className="product-count">{products.length} Products</span>
                        </div>
                    </div>
                    {message && <p className={`message ${message.includes("removed") ? "success" : ""}`}>{message}</p>}

                    <div className="product-table-card">
                        <table className="admin-product-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Categories</th>
                                    <th>Stock</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="empty-row">No products found</td>
                                    </tr>
                                )}
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td className="img-cell">
                                            <img
                                                src={getImageUrl(product.image)}
                                                alt={product.name || "product"}
                                                className="table-img"
                                            />
                                        </td>
                                        <td className="name-cell">
                                            <span className="product-name">{getDisplayValue(product.name)}</span>
                                        </td>
                                        <td className="price-cell">
                                            ₹{getDisplayValue(product.price)}
                                        </td>
                                        <td className="category-cell">
                                            {product.categories?.length > 0 ? (
                                                <div className="tag-container">
                                                    {product.categories.map(cat => <span key={cat} className="category-tag">{cat}</span>)}
                                                </div>
                                            ) : "-"}
                                        </td>
                                        <td className="stock-cell">
                                            <span className={`stock-status ${product.quantity > 0 ? "in-stock" : "out-of-stock"}`}>
                                                {getDisplayValue(product.quantity)}
                                            </span>
                                        </td>
                                        <td className="desc-cell">
                                            <span className="product-description">{getDisplayValue(product.description)}</span>
                                        </td>
                                        <td className="action-cell">
                                            <div className="action-buttons">
                                                <button type="button" className="edit-btn" onClick={() => startEdit(product)}>Edit</button>
                                                <button type="button" className="remove-btn" onClick={() => removeProduct(product._id)}>Remove</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewProduct;
