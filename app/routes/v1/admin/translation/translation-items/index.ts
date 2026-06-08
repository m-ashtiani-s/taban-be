import express from "express";
import TranslationValidation from "../../../../../../modules/translation/translationItem/validation/translationItem.validation";
import { TranslationAdminController } from "../../../../../../modules/translation/translationItem/controller/translationItem.admin.controller";

const translationItemsRouter = express.Router();
const translationController = new TranslationAdminController();

translationItemsRouter.get("/", translationController.getTranslationItems);
translationItemsRouter.get("/:translationItemId", TranslationValidation.translationItemId, translationController.getTranslationItem);
translationItemsRouter.post("/", TranslationValidation.createTranslationItem, translationController.createTranslationItem);
translationItemsRouter.post("/:translationItemId/activate", TranslationValidation.translationItemId, translationController.activateTranslationItem);
translationItemsRouter.post("/:translationItemId/deactivate", TranslationValidation.translationItemId, translationController.deactivateTranslationItem);
translationItemsRouter.put("/:translationItemId", TranslationValidation.translationItemId, TranslationValidation.updateTranslationItem, translationController.updateTranslationItem);
export default translationItemsRouter;
