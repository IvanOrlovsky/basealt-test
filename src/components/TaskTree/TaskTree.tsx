import React, { useState, useEffect, useMemo } from "react";
import { ReactFlow, Node, Edge, Background, useReactFlow } from "@xyflow/react";
import { ParsedHistoryType, ParsedTaskDataType } from "../../api";
import { TaskNode } from "./TaskNode";
import throttle from "lodash.throttle";
import { findRoots } from "./helpers";
import { TaskInfo } from "./TaskInfo";
import toast from "react-hot-toast";

import "./TaskTree.css";
import { copyToClipboard } from "../../heplers";

const nodeTypes = { taskNode: TaskNode };
const LAYER_SIZE = 100;

export function TaskTree({
	history,
	rootId,
}: {
	history: ParsedHistoryType;
	rootId?: string; // Опциональный ID корневой задачи
}) {
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);
	const [currentLayer, setCurrentLayer] = useState<string[]>([]);
	const [chuncksLoaded, setChuncksLoaded] = useState<number>(0);
	const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
	const [mostRootElement, setMostRootElement] = useState<string | null>(null); // Для возврата к корню(Самый корневый корень - первый корень из списка корней)

	const reactFlowInstance = useReactFlow();

	const LAYERS_PER_SCREEN = useMemo(
		() => Math.floor(window.screen.height / LAYER_SIZE) + 2,
		[]
	);

	// Функция для загрузки корней и первого чанка
	const loadInitialData = () => {
		if (Object.keys(history).length === 0) return;

		const roots = rootId !== undefined ? [rootId] : findRoots(history);

		if (roots.length === 0) return;

		const initialNodes: Node[] = roots.map((id, index) => ({
			id: `node-${id}`,
			data: { id: id, task: history[id] },
			type: "taskNode",
			position: { x: index * 200, y: 0 },
		}));

		// Загрузка первого чанка
		const firstChunkNodes: Node[] = [];
		const firstChunkEdges: Edge[] = [];

		//Сначала надо собрать ID всех детей текущего слоя, у которых есть запись в истории
		let currentChildren: string[] = roots
			.filter((id) => history[id] !== undefined)
			.filter((id) => history[id].prev !== undefined);

		// Загружаем LAYERS_PER_SCREEN новых слоев
		for (let i = 0; i < LAYERS_PER_SCREEN; i++) {
			//Теперь составить массив ID родителей c ID детей
			const currentPairs: Array<{ parentId: string; childId: string }> =
				currentChildren.map((child) => ({
					parentId: history[child]
						? String(history[child].prev)
						: "NONE", // Некоторые задачки не являются кому-то prev-ом и у самих prev ссылается на несуществующую задачку
					childId: child,
				}));

			//Добавляем всех родителей к узлам
			currentPairs.forEach(({ parentId, childId }, index) => {
				// Кроме задачек в "вакууме", так сказать
				if (parentId === "NONE") return;

				const parentData = history[parentId];

				// И кроме ID тех задач, которые кому-то родители, но их самих в истории нет
				if (parentData === undefined) return;

				const layerY = LAYER_SIZE * 2 + i * (LAYER_SIZE + 100); // Фиксированный шаг между слоями

				firstChunkNodes.push({
					id: `node-${parentId}`,
					data: { id: parentId, task: parentData },
					type: "taskNode",
					position: {
						x: index * 200 + Math.random() * 25 - 12,
						y: layerY,
					},
				});

				firstChunkEdges.push({
					id: `edge-${childId}-${parentId}`,
					source: `node-${childId}`,
					target: `node-${parentId}`,
					style: { strokeWidth: 10, color: "red" },
				});

				//Обновляем текущий слой
				currentChildren = currentPairs.map((pair) => pair.parentId);
			});
		}

		setNodes([...initialNodes, ...firstChunkNodes]);
		setEdges(firstChunkEdges);
		setCurrentLayer(currentChildren);
		setChuncksLoaded(1); // Установка первого чанка

		reactFlowInstance.fitView({
			nodes: [{ id: `node-${roots[0]}` }],
			duration: 500,
		});

		setMostRootElement(`node-${roots[0]}`);
	};

	useEffect(() => {
		// Сброс состояния при изменении истории
		setNodes([]);
		setEdges([]);
		setCurrentLayer([]);
		setChuncksLoaded(0);

		// Загрузка корней и первого чанка
		loadInitialData();
	}, [history, rootId, reactFlowInstance]);

	// useEffect для подгрузки последующих чанков
	useEffect(() => {
		// Подгрузка чанков происходит только если chuncksLoaded > 1
		if (chuncksLoaded <= 1 || currentLayer.length === 0) return;

		const newNodes: Node[] = [];
		const newEdges: Edge[] = [];

		let currentChildren: string[] = currentLayer
			.filter((id) => history[id] !== undefined)
			.filter((id) => history[id].prev !== undefined);

		for (let i = 0; i < LAYERS_PER_SCREEN; i++) {
			const currentPairs: Array<{ parentId: string; childId: string }> =
				currentChildren.map((child) => ({
					parentId: history[child]
						? String(history[child].prev)
						: "NONE",
					childId: child,
				}));

			currentPairs.forEach(({ parentId, childId }, index) => {
				if (parentId === "NONE") return;

				const parentData = history[parentId];
				if (parentData === undefined) return;

				const layerIndex = (chuncksLoaded - 1) * LAYERS_PER_SCREEN + i;
				const layerY = LAYER_SIZE * 2 + layerIndex * (LAYER_SIZE + 100);

				newNodes.push({
					id: `node-${parentId}`,
					data: { id: parentId, task: parentData },
					type: "taskNode",
					position: {
						x: index * 200 + Math.random() * 25 - 12,
						y: layerY,
					},
				});

				newEdges.push({
					id: `edge-${childId}-${parentId}`,
					source: `node-${childId}`,
					target: `node-${parentId}`,
					style: { strokeWidth: 10, color: "red" },
				});

				currentChildren = currentPairs.map((pair) => pair.parentId);
			});
		}

		if (newNodes.length > 0) {
			setNodes((prev) => [...prev, ...newNodes]);
			setEdges((prev) => [...prev, ...newEdges]);
			setCurrentLayer(currentChildren);
		}
	}, [chuncksLoaded]);

	const onViewportChange = throttle((viewport) => {
		const currentZoom = viewport.zoom;
		const visibleHeight =
			(-1 * viewport.y + window.innerHeight) / currentZoom;
		const lastNodeY =
			chuncksLoaded * LAYERS_PER_SCREEN * (LAYER_SIZE + 100) - 100;

		if (visibleHeight > lastNodeY) {
			setChuncksLoaded((prev) => prev + 1);
		}
	}, 500);

	return (
		<div style={{ width: "100vw", height: "100vh" }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				minZoom={0.2}
				maxZoom={2}
				onViewportChange={onViewportChange}
				onNodeMouseEnter={(event, node) => setHoveredNode(node)}
				onNodeMouseLeave={(event, node) => setHoveredNode(null)}
				onNodeClick={(event, node) => setHoveredNode(node)}
				onNodeDoubleClick={(event, node) =>
					copyToClipboard(node.data.id as string)
				}
				onlyRenderVisibleElements={true}
				nodesConnectable={false}
			>
				<Background bgColor="black" />
			</ReactFlow>
			{hoveredNode && (
				<TaskInfo
					task={hoveredNode.data.task as ParsedTaskDataType}
					id={hoveredNode.id}
				/>
			)}
			{mostRootElement && (
				<button
					onClick={() =>
						reactFlowInstance.fitView({
							nodes: [{ id: mostRootElement }],
							duration: 500,
						})
					}
					className="return-to-root-button"
				>
					Вернуться к корню
				</button>
			)}
		</div>
	);
}
