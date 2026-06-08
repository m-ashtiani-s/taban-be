import express from "express";
import TranslationItemCategoryController from "../../../../../../modules/translation/translationItemCategory/controller/translationItemCategory.controller";
import TranslationItemCategoryValidation from "../../../../../../modules/translation/translationItemCategory/validation/translationItemCategory.validation";

const translationItemsCategoriesRouter = express.Router();
const translationItemCategoryController = new TranslationItemCategoryController();

translationItemsCategoriesRouter.get("/", translationItemCategoryController.getTranslationItemCategories);
translationItemsCategoriesRouter.get("/:translationItemCategoryId", TranslationItemCategoryValidation.translationItemCategoryId, translationItemCategoryController.getTranslationItemCategory);
export default translationItemsCategoriesRouter;
