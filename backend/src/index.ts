import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import guideRoutes from "./routes/guideRoutes";
import postRoutes from "./routes/postRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import gameRoutes from "./routes/gameRoutes";
import testingRouter from "./controllers/testing";
import config from "./utils/config";
import {
  errorHandler,
  requestLogger,
  unknownEndpoint,
} from "./utils/middleware";
import path from "path";
import cookieParser from "cookie-parser";

const app = express();

const uri = config.MONGODB_URI;

if (uri) {
  mongoose
    .connect(uri, { dbName: config.MONGODB_DBNAME })
    .catch((error) => {
      console.log("Error connecting to MongoDB:", error.message);
    })
    .then(() => {
      console.log("Connected to MongoDB");
    });
}

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
} 

if (process.env.NODE_ENV !== "test") {
  app.use(express.static("dist"));
  app.get(/.*/, (_, response) => {
    response.sendFile(path.resolve(__dirname, "../dist", "index.html"));
  });
}


app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

app.use("/api/games", gameRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/login", authRoutes);

app.use(errorHandler);
app.use(unknownEndpoint);

const port = config.PORT;
app.listen(port, () => {
  console.log(`Server running on http://${config.HOST}:${port}`);
});

export default app;
