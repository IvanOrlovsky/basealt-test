import { Handle, Position } from "@xyflow/react";

import { ParsedTaskDataType } from "../../../api";
import "./TaskNode.css";

export const backgroundColors = {
	sisyphus: "#FFFFFF",
	p11: "#F5F5F5",
	p10: "#ADD8E6",
	p9: "#FFF47F",
	c10f2: "#FFD1DC",
	c9f2: "#ECFFDC",
};

export function TaskNode({
	data: { id, task },
}: {
	data: { id: string; task: ParsedTaskDataType };
}) {
	return (
		<div
			className="circle-node"
			style={{ backgroundColor: backgroundColors[task.branch] }}
		>
			<Handle type="target" position={Position.Top} />
			{id}
			<Handle type="source" position={Position.Bottom} />
		</div>
	);
}
