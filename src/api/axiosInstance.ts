import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

export const axiosInstance: AxiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.response.use(
	(response: AxiosResponse): AxiosResponse => {
		return response;
	},
	(error: AxiosError): Promise<AxiosError> => {
		if (error.response) {
			const status = error.response.status;

			switch (status) {
				case 404:
					console.error("Не найдено.");
					break;
				case 500:
					console.error("Ошибка сервера.");
					break;
				default:
					console.error(`Error ${status}: ${error.message}`);
			}
		}

		return Promise.reject(error);
	}
);
