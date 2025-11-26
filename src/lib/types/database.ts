export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
	id: string;
	user_id: string;
	title: string;
	description: string | null;
	priority: TaskPriority;
	due_date: string;
	status: TaskStatus;
	created_at: string;
	updated_at: string;
}

export interface TaskInsert {
	title: string;
	description?: string | null;
	priority: TaskPriority;
	due_date: string;
	status?: TaskStatus;
}

export interface TaskUpdate {
	title?: string;
	description?: string | null;
	priority?: TaskPriority;
	due_date?: string;
	status?: TaskStatus;
}

