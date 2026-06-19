import { body, ValidationChain } from "express-validator";

const dayField = (name: string, label: string): ValidationChain =>
	body(name)
		.notEmpty()
		.withMessage(`${label} الزامی است`)
		.bail()
		.isInt({ min: 0 })
		.withMessage(`${label} باید عددی صحیح و غیرمنفی باشد`);

const UrgencyValidation = {
	updateUrgency: [
		dayField("translationMinDays", "حداقل روز ترجمه"),
		dayField("translationMaxDays", "حداکثر روز ترجمه"),
		dayField("justiceMinDays", "حداقل روز تایید دادگستری"),
		dayField("justiceMaxDays", "حداکثر روز تایید دادگستری"),
		dayField("mfaMinDays", "حداقل روز تایید وزارت امور خارجه"),
		dayField("mfaMaxDays", "حداکثر روز تایید وزارت امور خارجه"),
	],
};

export default UrgencyValidation;
