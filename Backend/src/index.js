import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json({limit: "30mb", extended: true}));
app.use(cookieParser());
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
))
const port = process.env.PORT;
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(port, () => {
  console.log("Server running on port " + port);
  connectDB();
});
