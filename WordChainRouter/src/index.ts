import express, { Request, Response } from "express";
import wordChainRoutes from "./wordChainRoutes";
import adminRoutes from "./adminRoutes";

const app = express();
const PORT = process.env.PORT || 8088;

app.use(express.json());
app.use("/admin", adminRoutes);
app.use("/chain", wordChainRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to WordChain gateway, enjoy \r\n /chain/:start/:end");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
