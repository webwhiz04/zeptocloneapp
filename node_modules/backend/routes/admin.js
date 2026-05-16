import express from "express";
import { getAdminStats, getAllUsers, banUser } from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.put("/users/:id/ban", banUser);

export default router;
