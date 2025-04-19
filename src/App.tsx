import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import "@patternfly/react-core/dist/styles/base.css";
import "@xyflow/react/dist/style.css";
import { getAllTaskHistory, ParsedHistoryType } from "./api";
import { Helper, LoadingScreen } from "./components";
import { TaskTree } from "./components/TaskTree";
import { ReactFlowProvider } from "@xyflow/react";
import toast, { Toaster } from "react-hot-toast";

function App() {
	const [rawHistory, setRawHistory] = useState<any | null>(null);

	const loadHistory = async () => {
		try {
			const result = await getAllTaskHistory();
			setRawHistory(result);
		} catch (e) {
			toast.error(
				`Произошла ошибка при получении данных!\nПодробности: ${e}`
			);
		}
	};

	useEffect(() => {
		loadHistory();
	}, []);

	const history = useMemo(() => {
		if (!rawHistory) return null;

		const parsedHistory: ParsedHistoryType = {};

		for (let task of rawHistory.tasks) {
			parsedHistory[String(task.id)] = {
				prev: task.prev,
				branch: task.branch,
				date: task.date,
			};
		}

		for (let commit of rawHistory.branch_commits) {
			if (parsedHistory.hasOwnProperty(commit.task)) {
				parsedHistory[commit.task] = {
					...parsedHistory[commit.task],
					commit: { name: commit.name, date: commit.date },
				};
			}
		}

		return parsedHistory;
	}, [rawHistory]);

	return (
		<main>
			<Toaster />
			<Helper />
			{history ? (
				<>
					<ReactFlowProvider>
						<TaskTree history={history} />
					</ReactFlowProvider>
				</>
			) : (
				<LoadingScreen text="Подгружаем данные..." />
			)}
		</main>
	);
}

export default App;
