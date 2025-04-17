import React, { useEffect, useState } from "react";
import "./App.css";
import { getAllTaskHistory, TasksHistoryType } from "./api";

function App() {
	const [history, setHistory] = useState<TasksHistoryType>();

	const loadHistory = async () => {
		setHistory(await getAllTaskHistory());
	};

	useEffect(() => {
		loadHistory();
	}, []);

	return <div>{JSON.stringify(history, null, 4)}</div>;
}

export default App;
