import express from "express";
import mongoose from "mongoose";
import guideRoutes from "./routes/guideRoutes";
import userRoutes from "./routes/userRoutes";
import config from "./utils/config";
import { withUser } from "./utils/middleware";

const app = express();

const uri = config.MONGODB_URI;

if (uri) {
  mongoose.connect(uri, { dbName: config.MONGODB_DBNAME }).catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
}

app.use(express.json());

app.use("/api/guides", withUser, guideRoutes);
app.use("/api/users", withUser, userRoutes);

const port = config.PORT;
app.listen(port, () => {
  console.log(`Server running on http://${config.HOST}:${port}`);
});

export default app;
