<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
	<!-- Hero Section -->
	<div class="relative overflow-hidden">
		<div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

		<div class="relative max-w-7xl mx-auto px-6 py-32 sm:py-40 lg:py-48">
			<div class="text-center">
				<h1
					class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
				>
					<span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
						Proxie
					</span>
				</h1>
				<p class="text-xl sm:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto font-light">
					Manage your tasks efficiently with our beautiful task management system
				</p>
				<p class="text-lg text-gray-400 mb-12 max-w-xl mx-auto">
					Create, organize, and track your tasks with ease. Stay productive and never miss a deadline.
				</p>

				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
					{#if $page.data.session}
						<a href="/tasks" class="w-full sm:w-auto">
							<Button
								class="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
							>
								Go to Tasks
							</Button>
						</a>
					{:else}
						<a href="/login" class="w-full sm:w-auto">
							<Button
								class="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
							>
								Get Started
							</Button>
						</a>
						<a href="/signup" class="w-full sm:w-auto">
							<Button
								class="w-full px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-300 border border-slate-600 hover:border-slate-500"
							>
								Sign Up
							</Button>
						</a>
					{/if}
				</div>
			</div>

			<!-- Features Section -->
			<div class="mt-32 grid md:grid-cols-3 gap-8">
				<div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors duration-300">
					<div class="text-3xl mb-4">✨</div>
					<h3 class="text-xl font-bold text-white mb-3">Easy to Use</h3>
					<p class="text-gray-400">Simple and intuitive interface designed for productivity</p>
				</div>

				<div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors duration-300">
					<div class="text-3xl mb-4">🎯</div>
					<h3 class="text-xl font-bold text-white mb-3">Stay Organized</h3>
					<p class="text-gray-400">Organize tasks by priority, status, and due dates</p>
				</div>

				<div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors duration-300">
					<div class="text-3xl mb-4">⚡</div>
					<h3 class="text-xl font-bold text-white mb-3">Fast & Reliable</h3>
					<p class="text-gray-400">Lightning-fast performance with real-time updates</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(.bg-grid-pattern) {
		background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
		background-size: 50px 50px;
	}
</style>
