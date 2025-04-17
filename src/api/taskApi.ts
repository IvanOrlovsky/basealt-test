import { axiosInstance } from "./axiosInstance";
import { TasksHistoryType } from "./types";

/**
 * Функция запрашивает с API всю историю выполненных задач в активных ветках
 */
export async function getAllTaskHistory(): Promise<TasksHistoryType> {
	try {
		const response = await axiosInstance.get(
			process.env.REACT_APP_TASKS_ENDPOINT!
		);
		return response.data;
	} catch (e) {
		console.error("Ошибка при получении всей истории: ", e);
		throw e;
	}
}

/**
 * Функция запрашивает с API историю выполненных задач по конкретной задаче
 * @param task_id ID задачи
 */
export async function getTaskHistory(
	task_id: number
): Promise<TasksHistoryType> {
	try {
		const response = await axiosInstance.get(
			process.env.REACT_APP_TASKS_ENDPOINT!,
			{
				params: {
					task_id,
				},
			}
		);
		return response.data;
	} catch (e) {
		console.error("Ошибка при получении истории по ID задачи: ", e);
		throw e;
	}
}
