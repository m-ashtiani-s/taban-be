import Pagination from "../../utils/pagination.util";
import LocationRepository from "../repository/location.repository";

interface Province {
	id: number;
	name: string;
}

export default class LocationService {
	private locationRepository = new LocationRepository();

	async provinces(term: string, page: string, pageSize: string) {
		const pagination = new Pagination({
			page,
			pageSize,
		});
		const provinces = await this.locationRepository.findProvinces(term, pagination?.getOptions());
		return {
			field: "provinces",
			success: true,
			data: provinces,
			message: "لیست استان ها با موفقیت دریافت شد",
		};
	}
	async cities(term: string, page: string, pageSize: string,provinceId?:number) {
		const pagination = new Pagination({
			page,
			pageSize,
		});
        console.log(term, pagination?.getOptions(),provinceId)
		const provinces = await this.locationRepository.findCities(term, pagination?.getOptions(),provinceId);
		return {
			field: "cities",
			success: true,
			data: provinces,
			message: "لیست شهر ها با موفقیت دریافت شد",
		};
	}
}
