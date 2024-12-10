import express from "express";
import rouletteController from "../controllers/rouletteController.js";
const router = express.Router();

router.post("/", rouletteController.createRoulette);
router.patch("/:id/open", rouletteController.openRoulette);
router.post("/:id/bet", rouletteController.placeBet);
router.patch("/:id/close", rouletteController.closeRoulette);
router.get("/", rouletteController.listRoulettes);

export default router;
