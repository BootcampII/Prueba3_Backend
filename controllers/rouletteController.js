import Roulette from "../models/Roulette.js";

const createRoulette = async (req, res) => {
  const { customId } = req.body;
  if (!customId) {
    res.status(400).json({ message: "CustomId is required" });
  }
  try {
    const existingRoulette = await Roulette.findOne({ customId });
    if (existingRoulette) {
      res
        .status(400)
        .json({ message: "Roulette with this customId already exists" });
    }
    const roulette = new Roulette({ customId });
    await roulette.save();
    res
      .status(201)
      .json({ message: "Roulette created successfully", roulette });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error to create Roulette", error: err.message });
  }
};

const openRoulette = async (req, res) => {
  const { id } = req.params;

  try {
    const roulette = await Roulette.findOne({ customId: id });
    if (!roulette)
      return res.status(404).json({ message: "Roulette not found" });

    if (roulette.status === "opne") {
      return res.status(400).json({ message: "Roulette is already open" });
    }

    roulette.status = "open";
    await roulette.save();
    res.status(200).json({ message: "Roulette opened successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error to open Roulette", error: err.message });
  }
};

const placeBet = async (req, res) => {
  const { id } = req.params;
  const { type, value, amount, userId } = req.body;

  if (type === "number" && (value < 0 || value > 36)) {
    return res.status(400).json({ message: "Invalid bet value" });
  }

  if (type === "color" && !["red", "black"].includes(value)) {
    return res.status(400).json({ message: "Invalid bet color" });
  }

  if (amount > 10000) {
    return res.status(400).json({ message: "Invalid bet amount" });
  }

  try {
    const roulette = await Roulette.findOne({ customId: id, status: "open" });
    if (!roulette || roulette.status !== "open") {
      return res.status(404).json({ message: "Roulette close or not found" });
    }

    const bet = { type, value, amount, userId };
    roulette.bets.push(bet);
    await roulette.save();
    res.status(201).json({ message: "Bet placed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error to place bet", error: err.message });
  }
};

const closeRoulette = async (req, res) => {
  const { id } = req.params;

  try {
    const roulette = await Roulette.findOne({ customId: id });
    if (!roulette)
      return res.status(404).json({ message: "Roulette not found" });

    if (roulette.status === "closed") {
      return res.status(400).json({ message: "Roulette is already closed" });
    }

    const winningNumber = Math.floor(Math.random() * 37);
    const winningColor = winningNumber % 2 === 0 ? "red" : "black";

    const results = roulette.bets.map((bet) => {
      if (bet.type === "number" && bet.value === winningNumber) {
        return { userId: bet.userId, winnings: bet.amount * 5 };
      } else if (bet.type === "color" && bet.value === winningColor) {
        return { userId: bet.userId, winnings: bet.amount * 1.8 };
      }
      return { userId: bet.userId, winnings: 0 };
    });

    roulette.status = "closed";
    await roulette.save();

    res.status(200).json({
      message: "Roulette closed successfully",
      winningNumber,
      winningColor,
      results,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error to close Roulette", error: err.message });
  }
};

const listRoulettes = async (req, res) => {
  try {
    const roulettes = await Roulette.find({}, { bets: 0 });
    res.status(200).json({ message: "Roulettes found", roulettes });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error to list roulettes", error: err.message });
  }
};

export default {
  createRoulette: createRoulette,
  openRoulette: openRoulette,
  placeBet: placeBet,
  closeRoulette: closeRoulette,
  listRoulettes: listRoulettes,
};
