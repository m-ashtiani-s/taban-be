import express from "express";
import TranslationItemCategoryController from "../../../../../../modules/translation/translationItemCategory/controller/translationItemCategory.controller";

const translationItemsCategoriesRouter = express.Router();
const translationItemCategoryController = new TranslationItemCategoryController();

translationItemsCategoriesRouter.get("/", translationItemCategoryController.getTranslationItemCategories);
translationItemsCategoriesRouter.get("/:translationItemCategoryId", translationItemCategoryController.getTranslationItemCategory);
export default translationItemsCategoriesRouter;
