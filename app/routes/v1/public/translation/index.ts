import express from "express";
import translationItemsRouter from "./translation-items";
import languagesRouter from "./languages";

const translationRouter = express.Router();

translationRouter.use("/translation-items", translationItemsRouter);
translationRouter.use("/languages", languagesRouter);
export default translationRouter;
