import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addproduct.css";
import getImageUrl from "../utils/imageUrl.js";

import API_BASE_URL from "../services/api";

const BASE_URL = API_BASE_URL;
const API_URL = `${BASE_URL}/api/products`;


const callApi = (path = "", options = {}) => fetch(`${API_URL}${path}`, options);

const getNumericQuantity = (value) => {
    const raw = String(value ?? "").trim();
    const match = raw.match(/\d+(\.\d+)?/);
    return match ? match[0] : "";
};

const options = [
    { value: 'cafe', label: 'Cafe' },
    { value: 'home', label: 'Home' },
    { value: 'toys', label: 'Toys' },
    { value: 'fresh', label: 'Fresh' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'fashion', label: 'Fashion' },
];

function AddProduct({
    isEdit = false,
    editId = "",
    initialProduct = null,
    onSuccess,
    onCancel,
    embedded = false,
}) {
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [categories, setCategories] = useState([]);
    const [quantity, setQuantity] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [description, setDescription] = useState("");
    const [currentImage, setCurrentImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const editMode = isEdit && Boolean(editId);

    useEffect(() => {
        if (editMode && initialProduct?._id && initialProduct._id === editId) {
            setProductName(initialProduct.name || "");
            setPrice(initialProduct.price ?? "");
            setQuantity(getNumericQuantity(initialProduct.quantity));
            setDescription(initialProduct.description || "");
            setCurrentImage(initialProduct.image || "");
            setCategories(initialProduct.categories || []);
            setMessage("");
            setLoading(false);
            return;
        }

        const fetchProductById = async () => {
            if (!editMode) return;
            try {
                setLoading(true);
                setMessage("");
                const response = await callApi(`/${editId}`);
                const data = await response.json();
                if (!response.ok) {
                    setMessage(data?.message || "Failed to load product");
                    return;
                }
                const product = data?.product;
                setProductName(product.name || "");
                setPrice(product.price ?? "");
                setQuantity(getNumericQuantity(product.quantity));
                setDescription(product.description || "");
                setCurrentImage(product.image || "");
                setCategories(product.categories || []);
            } catch {
                setMessage("Could not load product details");
            } finally {
                setLoading(false);
            }
        };

        fetchProductById();
    }, [editMode, editId, initialProduct]);

    const handleClose = () => {
        if (editMode && onCancel) {
            onCancel();
            return;
        }

        if (editMode) {
            navigate("/admindashboard/viewproduct");
        } else {
            navigate("/admindashboard");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        if (!productName.trim() || !price || !quantity) {
            setMessage("Please fill product name, price, and quantity");
            return;
        }

        if (!Array.isArray(categories) || categories.length === 0) {
            setMessage("Please select at least one category");
            return;
        }

        if (Number(price) <= 0 || Number(quantity) < 0) {
            setMessage("Price must be greater than 0");
            return;
        }

        try {
            setSaving(true);

            let response;

            if (editMode) {
                const formData = new FormData();
                formData.append("name", productName.trim());
                formData.append("price", price);
                formData.append("quantity", quantity);
                formData.append("description", description.trim());
                formData.append("categories", JSON.stringify(categories));

                if (imageFile) {
                    formData.append("image", imageFile);
                }

                response = await callApi(`/${editId}`, {
                    method: "PUT",
                    body: formData,
                });
            } else {
                const formData = new FormData();
                formData.append("name", productName.trim());
                formData.append("price", price);
                formData.append("quantity", quantity);
                formData.append("description", description.trim());
                formData.append("categories", JSON.stringify(categories));
                if (imageFile) {
                    formData.append("image", imageFile);
                }

                response = await callApi("", {
                    method: "POST",
                    body: formData,
                });
            }

            const data = await response.json();

            if (!response.ok) {
                setMessage(data?.message || "Failed to save product");
                return;
            }

            if (editMode) {
                setMessage("Product updated successfully");
                onSuccess?.(data.product);
                return;
            }

            setMessage("Product saved successfully");
            setProductName("");
            setPrice("");
            setQuantity("");
            setImageFile(null);
            setDescription("");
            setCategories([]);
            onSuccess?.(data.product);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            setMessage("Could not connect to server");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={`add-product-container${embedded ? " embedded" : ""}`}>
            <form className="admin-form" onSubmit={handleSubmit} autoComplete="off">
                <header className="admin-content-header">
                    <h1>{editMode ? "Edit Product" : "Add Product"}</h1>
                </header>
                
                {message && <p className={`form-message ${message.includes("successfully") ? "success" : "error"}`}>{message}</p>}
                {loading && <p className="form-message">Loading product...</p>}

                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="productName">Product Name</label>
                        <input
                            id="productName"
                            type="text"
                            autoComplete="off"
                            placeholder="Enter product name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Price (₹)</label>
                            <input
                                id="price"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantity">Stock Quantity</label>
                            <input
                                id="quantity"
                                type="number"
                                placeholder="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Categories</label>
                        <div className="category-selection">
                            {options.map((opt) => (
                                <label key={opt.value} className="category-checkbox">
                                    <input
                                        type="checkbox"
                                        value={opt.value}
                                        checked={categories.includes(opt.value)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setCategories([...categories, opt.value]);
                                            } else {
                                                setCategories(categories.filter(c => c !== opt.value));
                                            }
                                        }}
                                    />
                                    <span>{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="Product description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Product Image</label>
                        <div className="image-upload-area">
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                            {currentImage && !imageFile && (
                                <div className="current-image-preview">
                                    <p>Current Image:</p>
                                    <img src={getImageUrl(currentImage)} alt="current" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button className="save-btn" type="submit" disabled={saving}>
                        {saving ? "Saving..." : editMode ? "Update Product" : "Save Product"}
                    </button>
                    {editMode && (
                        <button className="cancel-btn" type="button" onClick={handleClose}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default AddProduct;
