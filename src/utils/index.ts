import {isNil, omitBy} from "lodash";
import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};
const isNilOrEmpty = (value: any) => isNil(value) || value === "";
const filterParams = (params: any) => {
	return omitBy(params, isNilOrEmpty);
};
function addCommas(input: any) {
	if (input === undefined) return;
	// Remove non-digit characters except dot
	input = input?.toString()?.replace(/[^0-9.]/g, "");

	// Split the number into integer and decimal parts
	const parts = input?.split(".");
	let integerPart = parts[0];
	const decimalPart = parts[1] || "";

	// Add commas to the integer part
	integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	// Combine integer part and decimal part (if any)
	if (decimalPart !== "") {
		return integerPart + "." + decimalPart;
	} else {
		return integerPart;
	}
}
const convertToMemory = (value: any) => {
	return value / (1024 * 1024 * 1024);
};
function convertBandwidth(bytesPerSecond: any) {
	// Automatically select the unit based on size
	if (bytesPerSecond >= 1000000000) {
		// If bandwidth is 1 Gbps or more, use Gbps
		return `${bytesPerSecond / 1000000000} Gbps`;
	} else {
		// Otherwise, use Mbps
		return `${bytesPerSecond / 1000000} Mbps`;
	}
}

const rateVAT = 10; // %
const convertEuroToDollar = (euro: number) => {
	return parseFloat((euro * 1.08).toFixed(6));
};
export {
	addCommas,
	filterParams,
	convertToMemory,
	convertBandwidth,
	convertEuroToDollar,
	rateVAT,
};
