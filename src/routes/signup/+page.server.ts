import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/supabase/server';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (session) {
		throw redirect(303, '/tasks');
	}
	return {};
};

export const actions: Actions = {
	signup: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() || '';
		const password = formData.get('password')?.toString() || '';
		const confirmPassword = formData.get('confirmPassword')?.toString() || '';

		const validationErrors: Record<string, string> = {};

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !emailRegex.test(email)) {
			validationErrors.email = 'Please enter a valid email address';
		}

		// Password validation
		if (!password || password.length < 6) {
			validationErrors.password = 'Password must be at least 6 characters long';
		}

		// Password strength check
		if (password && password.length >= 6) {
			const hasUpperCase = /[A-Z]/.test(password);
			const hasLowerCase = /[a-z]/.test(password);
			const hasNumber = /[0-9]/.test(password);
			if (!hasUpperCase || !hasLowerCase || !hasNumber) {
				validationErrors.password =
					'Password must contain at least one uppercase letter, one lowercase letter, and one number';
			}
		}

		// Confirm password
		if (password !== confirmPassword) {
			validationErrors.confirmPassword = 'Passwords do not match';
		}

		if (Object.keys(validationErrors).length > 0) {
			return fail(400, { validationErrors });
		}

		const supabase = createSupabaseServerClient(event);

		const { data, error } = await supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			if (error.message.includes('already registered')) {
				return fail(400, { error: 'An account with this email already exists' });
			}
			return fail(400, { error: error.message });
		}

		if (data.user) {
			throw redirect(303, '/tasks');
		}

		return { success: true };
	}
};

