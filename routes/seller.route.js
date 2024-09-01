import express from "express";
import { seller, getSeller, getSellerByIdController } from "../controllers/seller.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post('/create', verifyToken, seller);
router.get('/:email', verifyToken, getSeller);
// Route for getting seller by ID
router.get('/id/:id', verifyToken, getSellerByIdController);


export default router;