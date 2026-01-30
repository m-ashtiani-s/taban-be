import express from "express";
import { TranslationController } from "../../../../../../modules/translation/translation/controller/translation.controller";

const translationPriceRouter = express.Router();
const translationController = new TranslationController();

translationPriceRouter.post("/", translationController.calculateDocumentPrice);
export default translationPriceRouter;
