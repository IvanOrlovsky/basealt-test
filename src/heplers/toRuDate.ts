import { DateTimeString } from "../api";

const options: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "long",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	second: "numeric",
};

export function toRuDate(dateTimeString: DateTimeString): string {
	const isoDateString = dateTimeString.replace(" ", "T");
	const date = new Date(isoDateString);

	return date.toLocaleDateString("ru-RU", options);
}
