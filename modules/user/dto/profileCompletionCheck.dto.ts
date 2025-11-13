export interface ProfileCompletionCheckDto {
	isCompleted: boolean;
	completionPercent: number;
	incompleteItems: IncompleteItem[];
}

export interface IncompleteItem {
	itemKey: string;
	itemName: string;
}
