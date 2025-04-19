export type ParsedHistoryType = Record<string, ParsedTaskDataType>;

export type ParsedTaskDataType = Omit<TaskType, "id"> & {
	commit?: Omit<BranchCommitType, "task">;
};

const branches = ["sisyphus", "p11", "p10", "p9", "c10f2", "c9f2"] as const;

export type BranchesType = (typeof branches)[number];

export type TasksHistoryType = {
	branches: typeof branches;
	tasks: Array<TaskType>;
	branch_commits: Array<BranchCommitType>;
};

export type TaskType = {
	id: number;
	prev: number;
	branch: BranchesType;
	date: DateTimeString;
};

export type BranchCommitType = {
	name: BranchesType;
	date: DateTimeString;
	task: number;
};

export type DateTimeString =
	`${number}-${number}-${number} ${number}:${number}:${number}`;
