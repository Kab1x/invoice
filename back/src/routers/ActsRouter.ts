import { Router } from "express";
import { getAllActs } from "../services/ActsService.js";

const ActsRouter = Router();

ActsRouter.get("/", getAllActs);

export default ActsRouter;
