import LocationRepository from "../location/repository/location.repository";

export function generateCityName(cityId: number) {
	const locationRepository = new LocationRepository();
	const city =  locationRepository.findCityById(cityId);
	return city?.name ?? "";
}
