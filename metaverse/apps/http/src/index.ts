import express from "express";
import { router } from "./routes/v1";

const app = express();
app.use(express.json());

const port = 3000;

app.use("/api/v1", router);

app.get("/", (req, res) => {
    res.send(`Backend is working fine`);
})

app.listen(port, () => {
    console.log(`Server is listengin on ${port}`);
}) 