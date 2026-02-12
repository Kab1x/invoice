import express from "express";
import cors from "cors";
import ActsRouter from "./routers/ActsRouter.js";
import InvoicesRouter from "./routers/InvoicesRouter.js";
import PatientsRouter from "./routers/PatientsRouter.js";
import ConventionsRouter from "./routers/ConventionsRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/invoices", InvoicesRouter);
app.use("/acts", ActsRouter);
app.use("/patients", PatientsRouter);
app.use("conventions", ConventionsRouter);

app.listen(3000, () => console.log("Server running on port 3000"));
