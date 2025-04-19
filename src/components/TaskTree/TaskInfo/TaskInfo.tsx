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
			<div>
				<h1>ID: {id.split("node-")[1]}</h1>
				<button onClick={() => handleSaveId(id.split("node-")[1])}>
					Скопировать ID
				</button>
			</div>
			<Divider />
			<p>Дата создания: {toRuDate(task.date)}</p>
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
