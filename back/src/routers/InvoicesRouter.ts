import { Router } from "express";
import { createInvoice } from "../services/InvoicesService.js";

const InvoicesRouter = Router();

InvoicesRouter.post("/", createInvoice);

export default InvoicesRouter;
