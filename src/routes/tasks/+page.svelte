<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { format } from 'date-fns';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Select from '$lib/components/ui/select/select.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import AlertDescription from '$lib/components/ui/alert/alert-description.svelte';
	import type { Task, TaskPriority, TaskStatus } from '$lib/types/database';

	let { data }: { data: { tasks: Task[] } } = $props();

	let tasks = $derived(data.tasks || []);
	let searchQuery = $state('');
	let sortBy = $state<'due_date' | 'priority' | 'created_at'>('created_at');
	let filterStatus = $state<TaskStatus | 'all'>('all');
	let filterPriority = $state<TaskPriority | 'all'>('all');
	let editingTask = $state<Task | null>(null);
	let showDeleteConfirm = $state<string | null>(null);
	let submitting = $state(false);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
	let validationErrors = $state<Record<string, string>>({});

	// Form state
	let formTitle = $state('');
	let formDescription = $state('');
	let formPriority = $state<TaskPriority>('Medium');
	let formDueDate = $state('');
	let formStatus = $state<TaskStatus>('Pending');

	function resetForm() {
		formTitle = '';
		formDescription = '';
		formPriority = 'Medium';
		formDueDate = '';
		formStatus = 'Pending';
		editingTask = null;
		validationErrors = {};
	}

	function startEdit(task: Task) {
		editingTask = task;
		formTitle = task.title;
		formDescription = task.description || '';
		formPriority = task.priority;
		formDueDate = task.due_date.split('T')[0];
		formStatus = task.status;
	}

	function cancelEdit() {
		resetForm();
	}

	function getPriorityColor(priority: TaskPriority) {
		switch (priority) {
			case 'High':
				return 'destructive';
			case 'Medium':
				return 'default';
			case 'Low':
				return 'secondary';
		}
	}

	function getStatusColor(status: TaskStatus) {
		switch (status) {
			case 'Completed':
				return 'default';
			case 'In Progress':
				return 'secondary';
			case 'Pending':
				return 'outline';
		}
	}

	// Filtered and sorted tasks
	let filteredTasks = $derived(() => {
		let result = [...tasks];

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter((task) => task.title.toLowerCase().includes(query));
		}

		// Status filter
		if (filterStatus !== 'all') {
			result = result.filter((task) => task.status === filterStatus);
		}

		// Priority filter
		if (filterPriority !== 'all') {
			result = result.filter((task) => task.priority === filterPriority);
		}

		// Sort
		result.sort((a, b) => {
			switch (sortBy) {
				case 'due_date':
					return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
				case 'priority':
					const priorityOrder: Record<TaskPriority, number> = { High: 3, Medium: 2, Low: 1 };
					return priorityOrder[b.priority] - priorityOrder[a.priority];
				case 'created_at':
				default:
					return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
			}
		});

		return result;
	});

	// Handle form submission
	function handleFormSubmit() {
		submitting = true;
		error = null;
		success = null;
		validationErrors = {};
		return async ({ update, result }: any) => {
			if (result.type === 'success') {
				success = editingTask ? 'Task updated successfully!' : 'Task created successfully!';
				resetForm();
				// Reload tasks
				await invalidateAll();
				await update();
			} else if (result.type === 'failure') {
				if (result.data?.validationErrors) {
					validationErrors = result.data.validationErrors;
				} else if (result.data?.error) {
					error = result.data.error;
				}
			}
			submitting = false;
		};
	}

	function handleDelete(id: string) {
		showDeleteConfirm = id;
	}

	async function confirmDelete() {
		submitting = true;
		error = null;
		return async ({ update }: any) => {
			await invalidateAll();
			await update();
			showDeleteConfirm = null;
			submitting = false;
		};
	}

	async function toggleStatus(task: Task) {
		const newStatus: TaskStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
		const formData = new FormData();
		formData.append('id', task.id);
		formData.append('status', newStatus);
		
		const response = await fetch('?/update', {
			method: 'POST',
			body: formData
		});
		
		if (response.ok) {
			await invalidateAll();
		}
	}
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<div class="container mx-auto px-4 py-8 max-w-7xl">
		<!-- Header -->
		<div class="flex justify-between items-center mb-8">
			<div>
				<h1 class="text-3xl font-bold">Task Management</h1>
				<p class="text-muted-foreground mt-1">Manage your tasks efficiently</p>
			</div>
			<form method="POST" action="?/logout">
				<Button type="submit" variant="outline">Logout</Button>
			</form>
		</div>

		{#if error}
			<Alert variant="destructive" class="mb-4">
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		{/if}
		{#if success}
			<Alert class="mb-4">
				<AlertDescription>{success}</AlertDescription>
			</Alert>
		{/if}

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Task Form -->
			<div class="lg:col-span-1">
				<Card>
					<CardHeader>
						<CardTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</CardTitle>
						<CardDescription>
							{editingTask ? 'Update task details' : 'Add a new task to your list'}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							method="POST"
							action={editingTask ? '?/update' : '?/create'}
							use:enhance={handleFormSubmit}
						>
							{#if editingTask}
								<input type="hidden" name="id" value={editingTask.id} />
							{/if}

							<div class="space-y-4">
								<div class="space-y-2">
									<Label for="title">Title *</Label>
									<Input
										id="title"
										name="title"
										bind:value={formTitle}
										placeholder="Enter task title"
										maxLength={100}
										required
										disabled={submitting}
									/>
									{#if validationErrors.title}
										<p class="text-sm text-destructive">{validationErrors.title}</p>
									{/if}
								</div>

								<div class="space-y-2">
									<Label for="description">Description</Label>
									<Textarea
										id="description"
										name="description"
										bind:value={formDescription}
										placeholder="Enter task description"
										maxLength={500}
										rows={3}
										disabled={submitting}
									/>
									{#if validationErrors.description}
										<p class="text-sm text-destructive">{validationErrors.description}</p>
									{/if}
									<p class="text-xs text-muted-foreground">
										{formDescription.length}/500 characters
									</p>
								</div>

								<div class="space-y-2">
									<Label for="priority">Priority *</Label>
									<Select
										id="priority"
										name="priority"
										bind:value={formPriority}
										required
										disabled={submitting}
									>
										<option value="Low">Low</option>
										<option value="Medium">Medium</option>
										<option value="High">High</option>
									</Select>
									{#if validationErrors.priority}
										<p class="text-sm text-destructive">{validationErrors.priority}</p>
									{/if}
								</div>

								<div class="space-y-2">
									<Label for="due_date">Due Date *</Label>
									<Input
										id="due_date"
										name="due_date"
										type="date"
										bind:value={formDueDate}
										required
										disabled={submitting}
									/>
									{#if validationErrors.due_date}
										<p class="text-sm text-destructive">{validationErrors.due_date}</p>
									{/if}
								</div>

								<div class="space-y-2">
									<Label for="status">Status</Label>
									<Select
										id="status"
										name="status"
										bind:value={formStatus}
										disabled={submitting}
									>
										<option value="Pending">Pending</option>
										<option value="In Progress">In Progress</option>
										<option value="Completed">Completed</option>
									</Select>
								</div>

								<div class="flex gap-2">
									<Button type="submit" class="flex-1" disabled={submitting}>
										{submitting
											? 'Saving...'
											: editingTask
												? 'Update Task'
												: 'Create Task'}
									</Button>
									{#if editingTask}
										<Button type="button" variant="outline" onclick={cancelEdit} disabled={submitting}>
											Cancel
										</Button>
									{/if}
								</div>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>

			<!-- Task List -->
			<div class="lg:col-span-2">
				<!-- Filters and Search -->
				<Card class="mb-6">
					<CardContent class="pt-6">
						<div class="space-y-4">
							<div>
								<Label for="search">Search Tasks</Label>
								<Input
									id="search"
									placeholder="Search by title..."
									bind:value={searchQuery}
								/>
							</div>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label for="sort">Sort By</Label>
									<Select id="sort" bind:value={sortBy}>
										<option value="created_at">Created Date</option>
										<option value="due_date">Due Date</option>
										<option value="priority">Priority</option>
									</Select>
								</div>
								<div>
									<Label for="filterStatus">Filter by Status</Label>
									<Select id="filterStatus" bind:value={filterStatus}>
										<option value="all">All Statuses</option>
										<option value="Pending">Pending</option>
										<option value="In Progress">In Progress</option>
										<option value="Completed">Completed</option>
									</Select>
								</div>
								<div>
									<Label for="filterPriority">Filter by Priority</Label>
									<Select id="filterPriority" bind:value={filterPriority}>
										<option value="all">All Priorities</option>
										<option value="High">High</option>
										<option value="Medium">Medium</option>
										<option value="Low">Low</option>
									</Select>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Tasks -->
				{#if filteredTasks().length === 0}
					<Card>
						<CardContent class="pt-6 text-center py-12">
							<p class="text-muted-foreground">
								{searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
									? 'No tasks match your filters'
									: 'No tasks yet. Create your first task!'}
							</p>
						</CardContent>
					</Card>
				{:else}
					<div class="space-y-4">
						{#each filteredTasks() as task (task.id)}
							<Card>
								<CardContent class="pt-6">
									<div class="flex justify-between items-start">
										<div class="flex-1">
											<div class="flex items-center gap-2 mb-2">
												<h3 class="text-lg font-semibold">{task.title}</h3>
												<Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
												<Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
											</div>
											{#if task.description}
												<p class="text-sm text-muted-foreground mb-2">
													{task.description.length > 100
														? task.description.substring(0, 100) + '...'
														: task.description}
												</p>
											{/if}
											<p class="text-xs text-muted-foreground">
												Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
											</p>
										</div>
										<div class="flex gap-2 ml-4">
											<Button
												variant="outline"
												size="sm"
												onclick={() => toggleStatus(task)}
												disabled={submitting}
											>
												{task.status === 'Completed' ? 'Mark Incomplete' : 'Mark Complete'}
											</Button>
											<Button variant="outline" size="sm" onclick={() => startEdit(task)}>
												Edit
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onclick={() => handleDelete(task.id)}
												disabled={submitting}
											>
												Delete
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<Card class="w-full max-w-md mx-4">
			<CardHeader>
				<CardTitle>Confirm Delete</CardTitle>
				<CardDescription>Are you sure you want to delete this task? This action cannot be undone.</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					method="POST"
					action="?/delete"
					use:enhance={confirmDelete}
				>
					<input type="hidden" name="id" value={showDeleteConfirm} />
					<div class="flex gap-2 justify-end">
						<Button
							type="button"
							variant="outline"
							onclick={() => (showDeleteConfirm = null)}
							disabled={submitting}
						>
							Cancel
						</Button>
						<Button type="submit" variant="destructive" disabled={submitting}>
							{submitting ? 'Deleting...' : 'Delete'}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	</div>
{/if}

