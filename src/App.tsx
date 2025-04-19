import React, { useEffect, useState, useMemo, FormEvent } from "react";
import "./App.css";
import "@patternfly/react-core/dist/styles/base.css";
import "@xyflow/react/dist/style.css";
import { getAllTaskHistory, getTaskHistory, ParsedHistoryType } from "./api";
import { Helper, LoadingScreen } from "./components";
import { TaskTree } from "./components/TaskTree";
import { ReactFlowProvider } from "@xyflow/react";
import toast, { Toaster } from "react-hot-toast";
import { TextInput, Button, Form, FormGroup } from "@patternfly/react-core";

function App() {
	const [rawHistory, setRawHistory] = useState<any | null>(null);
	const [searchId, setSearchId] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	// Загрузка всей истории при монтировании
	useEffect(() => {
		const loadInitialData = async () => {
			setIsLoading(true);
			try {
				const result = await getAllTaskHistory();
				setRawHistory(result);
			} catch (e) {
				toast.error(`Ошибка при загрузке данных: ${e}`);
			} finally {
				setIsLoading(false);
				setIsInitialLoad(false);
			}
		};

		loadInitialData();
	}, []);

	// Обработчик отправки формы
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		const inputElement = e.currentTarget.elements.namedItem(
			"search-input"
		) as HTMLInputElement;
		const searchText = inputElement.value.trim();

		try {
			const result =
				searchText === ""
					? await getAllTaskHistory()
					: await getTaskHistory(Number(searchText));

			setRawHistory(result);
			setSearchId(searchText);

			// Сброс значения ввода после успешного поиска
			if (searchText === "") {
				inputElement.value = "";
			}
		} catch (e) {
			toast.error(`Ошибка при поиске: ${e}`);
			setRawHistory(await getAllTaskHistory());
			setSearchId("");
		} finally {
			setIsLoading(false);
		}
	};

	// Обработчик сброса поиска
	const handleReset = async () => {
		const inputElement = document.getElementById(
			"search-input"
		) as HTMLInputElement;
		if (inputElement) {
			inputElement.value = "";
		}
		setRawHistory(await getAllTaskHistory());
		setSearchId("");
	};

	// Преобразование данных истории
	const history = useMemo(() => {
		if (!rawHistory) return null;

		const parsedHistory: ParsedHistoryType = {};

		// Обработка задач
		rawHistory.tasks?.forEach((task: any) => {
			parsedHistory[String(task.id)] = {
				prev: task.prev,
				branch: task.branch,
				date: task.date,
			};
		});

		// Обработка коммитов веток
		rawHistory.branch_commits?.forEach((commit: any) => {
			if (parsedHistory[commit.task]) {
				parsedHistory[commit.task] = {
					...parsedHistory[commit.task],
					commit: { name: commit.name, date: commit.date },
				};
			}
		});

		return parsedHistory;
	}, [rawHistory]);

	return (
		<div className="app-container">
			<Toaster position="top-right" />

			{/* Фиксированная панель поиска */}
			<div className="fixed-search-panel">
				<Helper />
				<Form onSubmit={handleSubmit} className="search-form">
					<FormGroup
						label="Поиск задачи по ID"
						fieldId="search-input"
					>
						<div className="search-group">
							<TextInput
								type="text"
								id="search-input"
								name="search-input"
								aria-label="Поиск по ID задачи"
								placeholder="Введите ID задачи..."
								defaultValue={searchId}
							/>
							<Button
								type="submit"
								variant="primary"
								isDisabled={isLoading}
							>
								{isLoading ? "Поиск..." : "Найти"}
							</Button>
							{searchId && (
								<Button
									variant="secondary"
									onClick={handleReset}
									isDisabled={isLoading}
								>
									Сбросить
								</Button>
							)}
						</div>
					</FormGroup>
				</Form>
			</div>

			{/* Основное содержимое с отступом */}
			<div className="content-container">
				{isInitialLoad ? (
					<LoadingScreen text="Загрузка данных..." />
				) : history ? (
					<ReactFlowProvider>
						<TaskTree
							rootId={searchId || undefined}
							history={history}
						/>
					</ReactFlowProvider>
				) : (
					<LoadingScreen text="Нет данных для отображения" />
				)}
			</div>
		</div>
	);
}

export default App;
