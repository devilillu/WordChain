import express, { Request, Response } from "express";
import wordChainRoutes from "./wordChainRoutes";

const app = express();
const PORT = process.env.PORT || 8088;

app.use(express.json());
app.use("/chain", wordChainRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to WordChain, try \r\n /chain/:start/:end");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
