import express from "express";
import TranslationController from "../../../../../../modules/translation/translationItem/controller/translation.controller";
import TranslationValidation from "../../../../../../modules/translation/translationItem/validation/translation.validation";

const translationItemsRouter = express.Router();
const translationController = new TranslationController();

translationItemsRouter.get("/", translationController.getTranslationItems);
translationItemsRouter.get("/:translationItemId", translationController.getTranslationItem);
translationItemsRouter.post("/", TranslationValidation.createTranslationItem, translationController.createTranslationItem);
export default translationItemsRouter;
