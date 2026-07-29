import express from "express";
import LanguageValidation from "../../../../../../modules/translation/language/validation/language.validation";
import { LanguageAdminController } from "../../../../../../modules/translation/language/controller/language.admin.controller";

const languagesRouter = express.Router();
const languageAdminController = new LanguageAdminController();

languagesRouter.post("/", LanguageValidation.createLanguage, languageAdminController.createLanguage);
languagesRouter.get("/", languageAdminController.getLanguages);
languagesRouter.put("/order", LanguageValidation.reorderLanguages, languageAdminController.reorderLanguages);
languagesRouter.get("/:languageId", LanguageValidation.languageId, languageAdminController.getLanguage);
languagesRouter.post("/:languageId/activate", LanguageValidation.languageId, languageAdminController.activateLanguage);
languagesRouter.post("/:languageId/deactivate", LanguageValidation.languageId, languageAdminController.deactivateLanguage);
languagesRouter.put("/:languageId", LanguageValidation.languageId, LanguageValidation.updateLanguage, languageAdminController.updateLanguage);
export default languagesRouter;
