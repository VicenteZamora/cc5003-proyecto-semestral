import express from "express";
import mongoose from "mongoose";
import guideRoutes from "./routes/guideRoutes";
import postRoutes from "./routes/postRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import config from "./utils/config";
import {
  errorHandler,
  requestLogger,
  unknownEndpoint,
  withUser,
} from "./utils/middleware";
import path from "path";

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

if (process.env.NODE_ENV !== "test") {
  app.use(express.static("dist"));
  app.get(/.*/, (_, response) => {
    response.sendFile(path.resolve(__dirname, "../dist", "index.html"));
  });
}

app.use(express.json());
app.use(requestLogger);

app.use("/api/guides", withUser, guideRoutes);
app.use("/api/posts", withUser, postRoutes);
app.use("/api/users", withUser, userRoutes);
app.use("/api/login", withUser, authRoutes);

app.use(errorHandler);
app.use(unknownEndpoint);

const port = config.PORT;
app.listen(port, () => {
  console.log(`Server running on http://${config.HOST}:${port}`);
});

export default app;
