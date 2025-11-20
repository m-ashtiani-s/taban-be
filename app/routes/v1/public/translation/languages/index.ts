import express from "express";
import LanguageController from "../../../../../../modules/translation/language/controller/language.controller";

const languagesRouter = express.Router();
const languageController = new LanguageController();

languagesRouter.get("/", languageController.getLanguages);
languagesRouter.get("/:languageId", languageController.getLanguage);
export default languagesRouter;
