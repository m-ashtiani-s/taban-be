import express from "express";
import TranslationController from "../../../../../../modules/translation/translationItem/controller/translationItem.controller";
import TranslationValidation from "../../../../../../modules/translation/translationItem/validation/translationItem.validation";

const translationItemsRouter = express.Router();
const translationController = new TranslationController();

translationItemsRouter.get("/", translationController.getTranslationItems);
translationItemsRouter.get("/:translationItemId", TranslationValidation.translationItemId, translationController.getTranslationItem);
export default translationItemsRouter;
