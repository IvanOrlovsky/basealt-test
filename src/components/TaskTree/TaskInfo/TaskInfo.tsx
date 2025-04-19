import { Divider } from "@patternfly/react-core";
import "./TaskInfo.css";
import { toRuDate } from "../../../heplers";
import { ParsedTaskDataType } from "../../../api";
import { backgroundColors } from "../TaskNode";
import toast from "react-hot-toast";

export function TaskInfo({
	task,
	id,
}: {
	task: ParsedTaskDataType;
	id: string;
}) {
	const handleSaveId = (id: string) => {
		navigator.clipboard.writeText(id);
		toast.success(`ID ${id} успешно скопирован!`);
	};

	return (
		<div
			className="node-container"
			style={{ backgroundColor: backgroundColors[task.branch] }}
		>
			<div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<h1>ID: {id.split("node-")[1]}</h1>
				<button onClick={() => handleSaveId(id.split("node-")[1])}>
					Скопировать ID
				</button>
				<p>Также можно дважды кликнуть по узлу для копирования!!!</p>
			</div>
			<Divider />
			<p>Дата создания: {toRuDate(task.date)}</p>
			<p>Ветка: {task.branch}</p>
			{task.commit && (
				<>
					<Divider />
					<span>
						Есть коммит с датой: {toRuDate(task.commit.date)}
					</span>
				</>
			)}
		</div>
	);
}
