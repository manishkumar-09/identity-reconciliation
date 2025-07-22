import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { router } from "./routes/identity.route";
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(router);
app.get("/", (req, res) => {
  res.send("Home");
});

app.listen(PORT, () => {
  console.log(`server is listening at : ${PORT}`);
});
