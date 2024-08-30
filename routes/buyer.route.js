import express from "express";
import {
    getBuyerByEmailController,
    getBuyerByIdController,
    getBuyersByIdsController // Import the new controller
} from "../controllers/buyer.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// Route to get a buyer by email
router.get('/email/:email', verifyToken, getBuyerByEmailController);

// Route to get a buyer by ID
router.get('/id/:id', verifyToken, getBuyerByIdController);

// Route to get buyers by an array of IDs
router.post('/ids', verifyToken, getBuyersByIdsController);

export default router;