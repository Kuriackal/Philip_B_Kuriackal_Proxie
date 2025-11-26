import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$lib/env';

export const handle: Handle = async ({ event, resolve }) => {
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY || 
		PUBLIC_SUPABASE_URL === 'your_supabase_project_url' || 
		PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
		console.error('⚠️  Missing or invalid Supabase environment variables!');
		console.error('Please update your .env file with your actual Supabase credentials:');
		console.error('1. Go to https://supabase.com and create a project');
		console.error('2. Get your Project URL and anon key from Project Settings → API');
		console.error('3. Update .env file with:');
		console.error('   PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
		console.error('   PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key');
		throw new Error(
			'Missing Supabase configuration. Please set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in your .env file with your actual Supabase credentials. See console for details.'
		);
	}

	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	event.locals.getSession = async () => {
		// Use getUser() to authenticate the user first (more secure)
		const {
			data: { user }
		} = await event.locals.supabase.auth.getUser();
		
		if (!user) return null;
		
		// After verifying user, get the session
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

