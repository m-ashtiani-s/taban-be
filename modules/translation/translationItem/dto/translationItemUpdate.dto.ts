export type TranslationItemUpdateDto = {
	title:string;
	documentType:string;
	category:string;
	description:string;
	uploadDescription:string;
	namePlaceholder:string;
	isActive:boolean;
	scoreMultiplier?:number;
};
