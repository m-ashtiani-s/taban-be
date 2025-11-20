import express from "express";
import TranslationValidation from "../../../../../../modules/translation/translationItem/validation/translation.validation";
import { TranslationAdminController } from "../../../../../../modules/translation/translationItem/controller/translation.admin.controller";

const translationItemsRouter = express.Router();
const translationController = new TranslationAdminController();

translationItemsRouter.get("/", translationController.getTranslationItems);
translationItemsRouter.get("/:translationItemId", translationController.getTranslationItem);
translationItemsRouter.post("/", TranslationValidation.createTranslationItem, translationController.createTranslationItem);
translationItemsRouter.post("/:translationItemId/activate", translationController.activateTranslationItem);
translationItemsRouter.post("/:translationItemId/deactivate", translationController.deactivateTranslationItem);
export default translationItemsRouter;
