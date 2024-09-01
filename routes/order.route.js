import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, intent, confirm, createOrder, updateOrderStatusToCompleted } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/:gigId", createOrder);
router.get("/", verifyToken, getOrders);
router.post("/create-payment-intent/:id", verifyToken, intent);
router.post("/", verifyToken, confirm);

// Route to update the order status to "completed"
router.post("/update-status", verifyToken, updateOrderStatusToCompleted);

export default router;