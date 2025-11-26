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
	login: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();
		const remember = formData.get('remember') === 'on';

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		const supabase = createSupabaseServerClient(event);

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		if (remember && data.session) {
			// Set a longer expiration for "remember me"
			event.cookies.set('sb-access-token', data.session.access_token, {
				path: '/',
				maxAge: 60 * 60 * 24 * 30, // 30 days
				sameSite: 'lax',
				httpOnly: true
			});
		}

		throw redirect(303, '/tasks');
	}
};

