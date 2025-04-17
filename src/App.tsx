import React, { useEffect, useState } from "react";
import "./App.css";
import "@patternfly/react-core/dist/styles/base.css";
import { getAllTaskHistory, TasksHistoryType } from "./api";
import { LoadingScreen } from "./components";

function App() {
	const [history, setHistory] = useState<TasksHistoryType | null>(null);

	const loadHistory = async () => {
		setHistory(await getAllTaskHistory());
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
