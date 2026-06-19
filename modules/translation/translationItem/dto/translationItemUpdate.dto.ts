export type TranslationItemUpdateDto = {
	title:string;
	documentType:string;
	category:string;
	description:string;
	uploadDescription:string;
	isActive:boolean;
	scoreMultiplier?:number;
};
