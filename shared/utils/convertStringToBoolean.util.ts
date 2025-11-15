export function convertStringToBoolean(str?: string | null): boolean | undefined {
	if (str === undefined || str === null || str === "") return undefined;
	return str === "true";
}
