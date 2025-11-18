import express from "express";
import TranslationController from "../../../../../../modules/translation/translationItem/controller/translation.controller";

const translationItemsRouter = express.Router();
const translationController = new TranslationController();

translationItemsRouter.get("/", translationController.getTranslationItems);
export default translationItemsRouter;
