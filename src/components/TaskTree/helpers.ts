import { ParsedHistoryType } from "../../api";

// Функция для поиска корней (узлов, чьи ID ни у кого не указаны в prev)
export const findRoots = (history: ParsedHistoryType): string[] => {
	const allIds = new Set(Object.keys(history));
	const childIds = new Set(
		Object.values(history)
			.map((task) => String(task.prev))
			.filter(Boolean)
	);
	return Array.from(allIds).filter((id) => !childIds.has(id));
};
