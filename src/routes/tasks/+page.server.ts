import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/supabase/server';
import type { Task, TaskInsert, TaskUpdate } from '$lib/types/database';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();
	if (!session) {
		throw redirect(303, '/login');
	}

	const supabase = createSupabaseServerClient(event);

	const { data: tasks, error } = await supabase
		.from('tasks')
		.select('*')
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('❌ Error loading tasks:', error);
		console.error('Error details:', {
			message: error.message,
			details: error.details,
			hint: error.hint,
			code: error.code
		});
		
		// Check if it's a table not found error (PGRST205 is PostgREST error for missing table)
		if (error.message?.includes('relation') || error.message?.includes('does not exist') || error.code === '42P01' || error.code === 'PGRST205') {
			console.error('');
			console.error('⚠️  DATABASE TABLE MISSING!');
			console.error('The "tasks" table does not exist in your Supabase database.');
			console.error('');
			console.error('To fix this:');
			console.error('1. Go to https://supabase.com and open your project');
			console.error('2. Click on "SQL Editor" in the left sidebar');
			console.error('3. Click "New query"');
			console.error('4. Copy and paste the SQL from: supabase/migrations/001_create_tasks_table.sql');
			console.error('5. Click "Run" to execute the SQL');
			console.error('6. Refresh this page');
			console.error('');
		}
		
		return { tasks: [] };
	}

	return {
		tasks: (tasks || []) as Task[]
	};
};

export const actions: Actions = {
	create: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await event.request.formData();
		const title = formData.get('title')?.toString() || '';
		const description = formData.get('description')?.toString() || null;
		const priority = formData.get('priority')?.toString() as 'Low' | 'Medium' | 'High';
		const due_date = formData.get('due_date')?.toString() || '';
		const status = (formData.get('status')?.toString() || 'Pending') as 'Pending' | 'In Progress' | 'Completed';

		// Validation
		const validationErrors: Record<string, string> = {};

		if (!title || title.trim().length === 0) {
			validationErrors.title = 'Title is required';
		} else if (title.length > 100) {
			validationErrors.title = 'Title must be 100 characters or less';
		}

		if (description && description.length > 500) {
			validationErrors.description = 'Description must be 500 characters or less';
		}

		if (!priority || !['Low', 'Medium', 'High'].includes(priority)) {
			validationErrors.priority = 'Priority is required';
		}

		if (!due_date) {
			validationErrors.due_date = 'Due date is required';
		}

		if (Object.keys(validationErrors).length > 0) {
			return fail(400, { validationErrors });
		}

		const supabase = createSupabaseServerClient(event);

		const taskData: TaskInsert = {
			title: title.trim(),
			description: description?.trim() || null,
			priority,
			due_date,
			status
		};

		const { error } = await supabase.from('tasks').insert({
			...taskData,
			user_id: session.user.id
		});

		if (error) {
			console.error('❌ Error creating task:', error);
			console.error('Error details:', {
				message: error.message,
				details: error.details,
				hint: error.hint,
				code: error.code
			});
			
			// Check if it's a table not found error (PGRST205 is PostgREST error for missing table)
			if (error.message?.includes('relation') || error.message?.includes('does not exist') || error.code === '42P01' || error.code === 'PGRST205') {
				return fail(500, { 
					error: 'Database table not found. Please run the SQL migration in Supabase. See terminal for details.' 
				});
			}
			
			return fail(500, { error: error.message });
		}

		return { success: true };
	},
	update: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await event.request.formData();
		const id = formData.get('id')?.toString();
		const title = formData.get('title')?.toString();
		const description = formData.get('description')?.toString();
		const priority = formData.get('priority')?.toString();
		const due_date = formData.get('due_date')?.toString();
		const status = formData.get('status')?.toString();

		if (!id) {
			return fail(400, { error: 'Task ID is required' });
		}

		const supabase = createSupabaseServerClient(event);

		const updateData: TaskUpdate = {};
		if (title !== null && title !== undefined) updateData.title = title.trim();
		if (description !== null) updateData.description = description?.trim() || null;
		if (priority) updateData.priority = priority as 'Low' | 'Medium' | 'High';
		if (due_date) updateData.due_date = due_date;
		if (status) updateData.status = status as 'Pending' | 'In Progress' | 'Completed';

		const { error } = await supabase
			.from('tasks')
			.update(updateData)
			.eq('id', id)
			.eq('user_id', session.user.id);

		if (error) {
			console.error('❌ Error updating task:', error);
			return fail(500, { error: error.message });
		}

		return { success: true };
	},
	delete: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await event.request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Task ID is required' });
		}

		const supabase = createSupabaseServerClient(event);

		const { error } = await supabase.from('tasks').delete().eq('id', id).eq('user_id', session.user.id);

		if (error) {
			console.error('❌ Error deleting task:', error);
			return fail(500, { error: error.message });
		}

		return { success: true };
	},
	logout: async (event) => {
		const supabase = createSupabaseServerClient(event);
		await supabase.auth.signOut();
		throw redirect(303, '/login');
	}
};

