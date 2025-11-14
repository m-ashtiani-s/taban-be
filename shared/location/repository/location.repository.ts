import { City } from "../../../types/city.type";
import { Province } from "../../../types/Province.type";
import { PaginationInput, PaginationResult } from "../../utils/pagination.util";
import fs from "fs";
import path from "path";

export default class LocationRepository {
	async findProvinces(term: string, pagination: PaginationInput): Promise<PaginationResult<Province> | null> {
		const filePath = path.join(__dirname, "../../../assets/provinces.json");
		const rawData = fs.readFileSync(filePath, "utf-8");
		const provincesData: Province[] = JSON.parse(rawData);

		let result: Province[] = [];
		let page = 1;
		if (term) {
			const newResult = provincesData.filter((p) => p.name.includes(term));
			result = newResult;
		} else {
			result = provincesData;
		}

		const totalElements = result.length;
		const totalPages = Math.ceil(totalElements / pagination?.limit);

		if (pagination?.page < 1) page = 1;
		if (page > totalPages) page = totalPages || 1;

		const startIndex = (page - 1) * pagination?.limit;
		const elements = result.slice(startIndex, startIndex + pagination?.limit);

		return {
			page: pagination?.page,
			pageSize: pagination?.limit,
			totalElements,
			totalPages,
			elements,
		};
	}
	findProvinceById(id?: number) {
		const filePath = path.join(__dirname, "../../../assets/provinces.json");
		const rawData = fs.readFileSync(filePath, "utf-8");
		const provincesData: Province[] = JSON.parse(rawData);

		const result = provincesData?.find((p) => p?.id === id) ?? null;
		return result;
	}
	async findCities(term: string, pagination: PaginationInput, provinceId?: number): Promise<PaginationResult<City> | null> {
		const filePath = path.join(__dirname, "../../../assets/cities.json");
		const rawData = fs.readFileSync(filePath, "utf-8");
		const citiesData: City[] = JSON.parse(rawData);

		let result: City[] = [];
		let page = 1;
		if (term) {
			const newResult = citiesData.filter((p) => {
				if (provinceId) {
					return p.name.includes(term) && p?.provinceId === provinceId;
				} else {
					console.log("p?.provinceId === provinceId");
					return p.name.includes(term);
				}
			});
			result = newResult;
		} else if (provinceId) {
			const newResult = citiesData.filter((p) => {
				return p?.provinceId === provinceId;
			});
			result = newResult;
		} else {
			result = citiesData;
		}

		const totalElements = result.length;
		const totalPages = Math.ceil(totalElements / pagination?.limit);

		if (pagination?.page < 1) page = 1;
		if (page > totalPages) page = totalPages || 1;

		const startIndex = (page - 1) * pagination?.limit;
		const elements = result.slice(startIndex, startIndex + pagination?.limit);

		return {
			page: pagination?.page,
			pageSize: pagination?.limit,
			totalElements,
			totalPages,
			elements,
		};
	}
	findCityById(id?: number) {
		const filePath = path.join(__dirname, "../../../assets/provinces.json");
		const rawData = fs.readFileSync(filePath, "utf-8");
		const citiesData: City[] = JSON.parse(rawData);

		const result = citiesData?.find((p) => p?.id === id) ?? null;
		return result;
	}
}
