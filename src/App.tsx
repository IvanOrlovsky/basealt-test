import React, { useEffect, useState } from "react";
import "./App.css";
import "@patternfly/react-core/dist/styles/base.css";
import { getAllTaskHistory, ParsedHistoryType } from "./api";
import { LoadingScreen } from "./components";

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
			if (!!parsedHistory[commit.task]) {
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
			{history ? (
				JSON.stringify(history, null, 4)
			) : (
				<LoadingScreen text="Подгружаем данные..." />
			)}
		</main>
	);
}

export default App;
