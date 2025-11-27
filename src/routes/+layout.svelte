<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	import { page } from '$app/stores';

	let isMobileMenuOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Proxie - Task Management</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
	<!-- Navigation -->
	<nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
		<div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
			<a href="/" class="flex items-center gap-2 group">
				<div class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
					Proxie
				</div>
			</a>

			<div class="hidden md:flex items-center gap-1">
				<a href="/" class="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition">
					Home
				</a>
				{#if $page.data.session}
					<a href="/tasks" class="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition">
						Tasks
					</a>
					<form method="POST" action="/login?/logout" class="inline">
						<button type="submit" class="ml-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition">
							Logout
						</button>
					</form>
				{:else}
					<a href="/login" class="ml-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition">
						Login
					</a>
					<a href="/signup" class="ml-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300">
						Sign Up
					</a>
				{/if}
			</div>

			<!-- Mobile Menu Button -->
			<button
				class="md:hidden p-2 hover:bg-slate-100 rounded-lg transition"
				on:click={() => (isMobileMenuOpen = !isMobileMenuOpen)}
			>
				<svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		</div>

		<!-- Mobile Menu -->
		{#if isMobileMenuOpen}
			<div class="md:hidden border-t border-slate-200 bg-white">
				<div class="px-6 py-4 space-y-2">
					<a href="/" class="block px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition">
						Home
					</a>
					{#if $page.data.session}
						<a href="/tasks" class="block px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition">
							Tasks
						</a>
						<form method="POST" action="/login?/logout">
							<button type="submit" class="w-full text-left px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition">
								Logout
							</button>
						</form>
					{:else}
						<a href="/login" class="block px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition">
							Login
						</a>
						<a href="/signup" class="block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg text-center">
							Sign Up
						</a>
					{/if}
				</div>
			</div>
		{/if}
	</nav>

	<!-- Main Content -->
	<main class="min-h-[calc(100vh-70px)]">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="border-t border-slate-200 bg-white/50 backdrop-blur-sm py-8 mt-16">
		<div class="max-w-7xl mx-auto px-6 text-center text-slate-600">
			<p>&copy; 2024 Proxie. Built with ❤️ using SvelteKit and Supabase.</p>
		</div>
	</footer>
</div>
