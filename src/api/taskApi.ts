import axios from "axios";
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
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				switch (error.response.status) {
					case 400:
						throw new Error("Некорректный запрос");
					case 404:
						throw new Error("Не найдено");
					default:
						throw new Error(
							`Ошибка сервера: ${error.response.status}`
						);
				}
			} else if (error.request) {
				throw new Error("Не удалось получить ответ от сервера");
			} else {
				throw new Error(
					`Ошибка при выполнении запроса: ${error.message}`
				);
			}
		}
		throw error;
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
			{ params: { task_id } }
		);

		// Проверяем, есть ли задача с таким ID в ответе (ОКАЗЫВАЕТСЯ НЕ ВСЕГДА ТАК)
		if (
			!response.data.tasks ||
			!response.data.tasks.some((task: any) => task.id === task_id)
		) {
			throw new Error(
				`Задача с ID ${task_id} не найдена в ответе сервера`
			);
		}

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				switch (error.response.status) {
					case 400:
						throw new Error(
							"Некорректный запрос: проверьте введенный ID"
						);
					case 404:
						throw new Error("Задача с указанным ID не найдена");
					default:
						throw new Error(
							`Ошибка сервера: ${error.response.status}`
						);
				}
			} else if (error.request) {
				throw new Error("Не удалось получить ответ от сервера");
			} else {
				throw new Error(
					`Ошибка при выполнении запроса: ${error.message}`
				);
			}
		}
		throw error;
	}
}
