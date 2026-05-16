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
        <div className="viewProductContainer">
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
                <div className="viewTableSection">
                    <div className="viewheader">
                        <h2>Manage Products</h2>
                        <div className="viewActions">
                            <span className="productCount">{products.length} Products</span>
                        </div>
                    </div>
                    {message && <p className={`message ${message.includes("removed") ? "success" : ""}`}>{message}</p>}

                    <div className="productTableCard">
                        <table className="adminProductTable">
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
                                        <td colSpan={7} className="emptyRow">No products found</td>
                                    </tr>
                                )}
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td className="imgCell">
                                            <img
                                                src={getImageUrl(product.image)}
                                                alt={product.name || "product"}
                                                className="tableImg"
                                            />
                                        </td>
                                        <td className="nameCell">
                                            <span className="productName">{getDisplayValue(product.name)}</span>
                                        </td>
                                        <td className="priceCell">
                                            ₹{getDisplayValue(product.price)}
                                        </td>
                                        <td className="categoryCell">
                                            {product.categories?.length > 0 ? (
                                                <div className="tagContainer">
                                                    {product.categories.map(cat => <span key={cat} className="categoryTag">{cat}</span>)}
                                                </div>
                                            ) : "-"}
                                        </td>
                                        <td className="stockCell">
                                            <span className={`stock-status ${product.quantity > 0 ? "in-stock" : "out-of-stock"}`}>
                                                {getDisplayValue(product.quantity)}
                                            </span>
                                        </td>
                                        <td className="descCell">
                                            <span className="productDescription">{getDisplayValue(product.description)}</span>
                                        </td>
                                        <td className="actionCell">
                                            <div className="actionButtons">
                                                <button type="button" className="editBtn" onClick={() => startEdit(product)}>Edit</button>
                                                <button type="button" className="removeBtn" onClick={() => removeProduct(product._id)}>Remove</button>
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
