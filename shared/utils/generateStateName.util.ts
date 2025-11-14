import LocationRepository from "../location/repository/location.repository";

export function generateStateName(stateId: number) {
	const locationRepository = new LocationRepository();
	const province =  locationRepository.findProvinceById(stateId);
	return province?.name ?? "";
}
