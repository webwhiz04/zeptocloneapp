import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCart from "../hooks/useCart.js";
import "./productdetail.css";
import getImageUrl, { getPlaceholderUrl } from "../utils/imageUrl.js";
import Footer from "../components/Footer.jsx";

import API_BASE_URL from "../services/api";

const BASE_URL = API_BASE_URL;
const API_URL = `${BASE_URL}/api/products`;

const getDiscountPercent = (price) => {
    const numericPrice = Number(price || 0);
    if (numericPrice <= 0) return 0;

    
    return 12;
};

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleAdd } = useCart();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data?.message || "Unable to fetch product details");
                }

                const fetchedProduct = data?.product || null;
                setProduct(fetchedProduct);

                if (fetchedProduct?.image) {
                    setSelectedImage(getImageUrl(fetchedProduct.image));
                }
            } catch (fetchError) {
                setProduct(null);
                setError(fetchError?.message || "Unable to load product details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const imageList = useMemo(() => {
        if (!product) return [];

        const images = [];

        if (Array.isArray(product.images)) {
            product.images.forEach((item) => {
                const url = getImageUrl(item);
                if (url) images.push(url);
            });
        }

        const mainImage = getImageUrl(product.image);
        if (mainImage) {
            images.unshift(mainImage);
        }

        const uniqueImages = [...new Set(images)];

        if (uniqueImages.length === 0) {
            uniqueImages.push(getPlaceholderUrl(550, 550));
        }

        return uniqueImages;
    }, [product]);

    const activeImage = selectedImage || imageList[0] || getPlaceholderUrl(550, 550);
    const numericPrice = Number(product?.price || 0);
    const discountPercent = getDiscountPercent(product?.price);
    const originalPrice = numericPrice > 0 ? numericPrice + Math.round((numericPrice * discountPercent) / 100) : 0;

    if (loading) {
        return (
            <div className="productDetailPageWrapper">
                <div className="productDetailStatus">Loading product details...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="productDetailPageWrapper">
                <div className="productDetailStatus error">
                    <p>{error || "Product not found"}</p>
                    <button type="button" className="productDetailBack" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="productDetailPageWrapper">
            <div className="productPage">
                <div className="left">
                    <img
                        className="productMainImage"
                        src={activeImage}
                        alt={product.name || "product"}
                        onError={(event) => {
                            event.currentTarget.src = getPlaceholderUrl(550, 550);
                        }}
                    />

                    <div className="productThumbnails">
                        {imageList.map((image) => (
                            <button
                                key={image}
                                type="button"
                                className={`thumbnailBtn ${activeImage === image ? "active" : ""}`}
                                onClick={() => setSelectedImage(image)}
                            >
                                <img src={image} alt="thumbnail" />
                            </button>
                        ))}
                    </div>

                    <button type="button" className="productAddToCart" onClick={() => handleAdd(product)}>
                        Add to Cart
                    </button>
                </div>

                <div className="right">
                    <div className="productDetailHeader">
                        <h1>{product.name || "Untitled Product"}</h1>
                        <p className="productCategories">
                            {(Array.isArray(product.categories) && product.categories.length > 0)
                                ? product.categories.join(" • ")
                                : "General"}
                        </p>
                    </div>

                    <section className="productPriceBlock">
                        <p className="salePrice">₹{numericPrice.toFixed(2)}</p>
                        {originalPrice > 0 && (
                            <p className="mrpRow">
                                <span className="mrp">₹{originalPrice.toFixed(2)}</span>
                                <span className="discount">{discountPercent}% OFF</span>
                            </p>
                        )}
                    </section>

                    <section className="productRatingBlock">
                        <h3>Ratings</h3>
                        <p>4.2 ★ average rating from verified buyers</p>
                    </section>

                    <section className="productOffersBlock">
                        <h3>Offers & Coupons</h3>
                        <ul>
                            <li>10% instant discount on selected bank cards</li>
                            <li>Use coupon SAVE50 to get ₹50 off on orders above ₹999</li>
                            <li>Free shipping for prepaid orders</li>
                        </ul>
                    </section>

                    <section className="productDescriptionBlock">
                        <h3>Description</h3>
                        <p>{product.description?.trim() || "No description available"}</p>
                        <p>Quantity available: {product.quantity || "NA"}</p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProductDetailPage;
