export interface PaginationOptions {
	page?: number | string;
	pageSize?: number | string;
	sortOrders?: string;
}

export interface PaginationInput {
	page: number;
	limit: number;
	skip: number;
	sort: Record<string, 1 | -1>;
}
export interface PaginationResult<T> {
	page: number;
	pageSize: number;
	totalPages: number;
	totalElements: number;
	elements: T[];
}

export default class Pagination {
	private page: number;
	private limit: number;
	private sort: Record<string, 1 | -1>;

	constructor({ page, pageSize, sortOrders }: PaginationOptions = {}) {
		this.page = Math.max(1, Number(page) || 1);
		this.limit = Math.max(1, Number(pageSize) || 10);
		this.sort = this.parseSortOrders(sortOrders);
	}

	private parseSortOrders(sortOrders?: string): Record<string, 1 | -1> {
		if (!sortOrders) {
			return { createdAt: -1 };
		}

		const [field, order] = sortOrders.split(":").map((s) => s.trim());
		return { [field]: order?.toUpperCase() === "ASC" ? 1 : -1 };
	}

	getOptions(): PaginationInput {
		const skip = (this.page - 1) * this.limit;
		return {
			page: this.page,
			limit: this.limit,
			skip,
			sort: this.sort,
		};
	}
}
