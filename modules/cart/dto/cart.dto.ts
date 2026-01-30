import { OrderedDocumentDto } from "./orderedDocumentDto.dto";

export interface cartDto {
	cartId: string;
	documents: OrderedDocumentDto[];
	cartSum: number;
	cartSumWithDiscount: number;
}
