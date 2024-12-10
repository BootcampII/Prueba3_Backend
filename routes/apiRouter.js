import express from "express";
const router = express.Router();
import rouletteRoutes from "./rouletteRoutes.js";

router.use("/api", rouletteRoutes);

export default router;
