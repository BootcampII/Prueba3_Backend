import mongoose from "mongoose";

const RouletteSchema = new mongoose.Schema({
  customId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "closed",
  },

  bets: [
    {
      type: {
        type: String,
        enum: ["number", "color"],
      },
      value: {
        type: mongoose.Schema.Types.Mixed,
      },
      amount: {
        type: Number,
        max: 10000,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
    },
  ],
});

const Roulette = mongoose.model("Roulette", RouletteSchema);

export default Roulette;
