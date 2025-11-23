import express from "express";
import { TranslationItemCategoryAdminController } from "../../../../../../modules/translation/translationItemCategory/controller/translationItemCategory.admin.controller";
import TranslationItemCategoryValidation from "../../../../../../modules/translation/translationItemCategory/validation/translationItemCategory.validation";

const translationItemsCategoriesRouter = express.Router();
const translationItemCategoryAdminController = new TranslationItemCategoryAdminController();

translationItemsCategoriesRouter.get("/", translationItemCategoryAdminController.getTranslationItemCategories);
translationItemsCategoriesRouter.get("/:translationItemCategoryId", translationItemCategoryAdminController.getTranslationItemCategory);
translationItemsCategoriesRouter.post("/", TranslationItemCategoryValidation.createTranslationItemCategory, translationItemCategoryAdminController.createTranslationItemCategory);
translationItemsCategoriesRouter.put("/:translationItemCategoryId",TranslationItemCategoryValidation.updateTranslationItemCategory, translationItemCategoryAdminController.updateTranslationItemCategory);
export default translationItemsCategoriesRouter;
