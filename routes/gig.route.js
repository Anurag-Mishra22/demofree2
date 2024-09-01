import express from "express";
import {
    gigCreate,
    gigGet,
    gigsGet,
    gigsGetByIdsRec
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, gigCreate);
// router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", gigGet);
router.post("/filters", gigsGet);
router.post('/gigsByIds', gigsGetByIdsRec);

export default router;

