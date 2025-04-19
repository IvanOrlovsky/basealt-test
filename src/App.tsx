import React, { useEffect, useState } from "react";
import "./App.css";
import "@patternfly/react-core/dist/styles/base.css";
import "@xyflow/react/dist/style.css";
import { getAllTaskHistory, ParsedHistoryType } from "./api";
import { Helper, LoadingScreen } from "./components";
import { TaskTree } from "./components/TaskTree";
import { ReactFlowProvider } from "@xyflow/react";
import { Toaster } from "react-hot-toast";

function App() {
	const [history, setHistory] = useState<ParsedHistoryType | null>(null);

	const loadHistory = async () => {
		const result = await getAllTaskHistory();
		const parsedHistory: ParsedHistoryType = {};

		for (let task of result.tasks) {
			parsedHistory[String(task.id)] = {
				prev: task.prev,
				branch: task.branch,
				date: task.date,
			};
		}

		for (let commit of result.branch_commits) {
			if (parsedHistory.hasOwnProperty(commit.task)) {
				parsedHistory[commit.task] = {
					...parsedHistory[commit.task],
					commit: { name: commit.name, date: commit.date },
				};
			}
		}

		setHistory(parsedHistory);
	};

	useEffect(() => {
		loadHistory();
	}, []);

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
