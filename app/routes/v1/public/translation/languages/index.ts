import express from "express";
import LanguageController from "../../../../../../modules/translation/language/controller/language.controller";
import LanguageValidation from "../../../../../../modules/translation/language/validation/language.validation";

const languagesRouter = express.Router();
const languageController = new LanguageController();

languagesRouter.get("/", languageController.getLanguages);
languagesRouter.get("/:languageId", LanguageValidation.languageId, languageController.getLanguage);
export default languagesRouter;
