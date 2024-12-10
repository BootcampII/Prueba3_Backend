import express from "express";
import cors from "cors";
import connectDB from "./db/config.js";
import api from "./routes/apiRouter.js";
process.loadEnvFile();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use("/", api);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
