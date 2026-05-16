import express from "express";
import { checkoutOnline, verifyOnlinePayment } from "../controllers/orderController.js";
import { getRazorpayConfig } from "../controllers/paymentController.js";

const router = express.Router();


router.get("/config", getRazorpayConfig);


router.post("/checkout", checkoutOnline);
router.post("/verify-payment", verifyOnlinePayment);

export default router;
