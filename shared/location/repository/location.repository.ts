
import { Province } from "../../../types/Province.type";
import { PaginationInput, PaginationResult } from "../../utils/pagination.util";
import fs from "fs";
import path from "path";


export default class LocationRepository {
	async findProvinces(term: string, pagination: PaginationInput): Promise<PaginationResult<Province> | null> {
		const filePath = path.join(__dirname, "../../../assets/provinces.json");
		const rawData = fs.readFileSync(filePath, "utf-8");
		const provincesData:Province[] = JSON.parse(rawData);

        let result:Province[]=[]
        let page=1
		if (term) {
			const newResult = provincesData.filter((p) => p.name.includes(term));
            result=newResult
		}else{
            result=provincesData
        }

		const totalElements = result.length;
		const totalPages = Math.ceil(totalElements / pagination?.limit);

		if (pagination?.page < 1) page = 1;
		if (page > totalPages) page = totalPages || 1;

		const startIndex = (page - 1) * pagination?.limit;
		const elements = result.slice(startIndex, startIndex + pagination?.limit);

		return {
			page:pagination?.page,
			pageSize:pagination?.limit,
			totalElements,
			totalPages,
			elements,
		};
	}
}
