import express from "express";
import RateController from "../../../../../modules/rate/controller/rate.controller";
import TranslationValidation from "../../../../../modules/translation/validation/translation.validation";
import TranslationController from "../../../../../modules/translation/controller/rate.controller";

const translationRouter = express.Router();
const translationController = new TranslationController();

translationRouter.post("/translation-item",TranslationValidation.createTranslationItem, translationController.createTranslationItem);
translationRouter.get("/translation-items", translationController.getTranslationItems);
export default translationRouter;
