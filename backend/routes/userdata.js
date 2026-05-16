import express from "express";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  getShippingAddress,
  saveShippingAddress,
} from "../controllers/userController.js";
import {
  getOrders,
  placeCodOrder,
  getAdminOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();


router.get("/cart", getCart);
router.post("/cart/add", addToCart);
router.patch("/cart/item", updateCartQuantity);
router.post("/remove-from-cart", removeFromCart); 


router.get("/shipping-address", getShippingAddress);
router.post("/shipping-address", saveShippingAddress);


router.post("/orders/place", placeCodOrder);
router.get("/orders", getOrders);


router.get("/admin/orders", getAdminOrders);
router.patch("/admin/orders/status", updateOrderStatus);
router.post("/admin/update-order-status", updateOrderStatus); 

export default router;
