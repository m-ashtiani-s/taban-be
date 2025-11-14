import LocationRepository from "../location/repository/location.repository";

export function generateProvinceName(provinceId: number) {
	const locationRepository = new LocationRepository();
	const province =  locationRepository.findProvinceById(provinceId);
	return province?.name ?? "";
}
