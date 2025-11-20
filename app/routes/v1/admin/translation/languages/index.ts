import express from "express";
import LanguageController from "../../../../../../modules/translation/language/controller/language.controller";
import LanguageValidation from "../../../../../../modules/translation/language/validation/language.validation";
import { LanguageAdminController } from "../../../../../../modules/translation/language/controller/language.admin.controller";

const languagesRouter = express.Router();
const languageAdminController = new LanguageAdminController();

languagesRouter.post("/",LanguageValidation.createLanguage, languageAdminController.createLanguage);
languagesRouter.get("/", languageAdminController.getLanguages);
languagesRouter.get("/:languageId", languageAdminController.getLanguage);
languagesRouter.post("/:languageId/activate", languageAdminController.activateLanguage);
languagesRouter.post("/:languageId/deactivate", languageAdminController.deactivateLanguage);
export default languagesRouter;
