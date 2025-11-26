<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import AlertDescription from '$lib/components/ui/alert/alert-description.svelte';

	let form: HTMLFormElement;
	let submitting = $state(false);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
	<Card class="w-full max-w-md">
		<CardHeader>
			<CardTitle>Login</CardTitle>
			<CardDescription>Enter your email and password to access your account</CardDescription>
		</CardHeader>
		<CardContent>
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

			<form
				bind:this={form}
				method="POST"
				action="?/login"
				use:enhance={() => {
					submitting = true;
					error = null;
					success = null;
					return async ({ update, result }) => {
						if (result.type === 'failure' && result.data?.error) {
							error = String(result.data.error);
						}
						await update();
						submitting = false;
					};
				}}
			>
				<div class="space-y-4">
					<div class="space-y-2">
						<Label for="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							required
							disabled={submitting}
						/>
					</div>
					<div class="space-y-2">
						<Label for="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							required
							disabled={submitting}
						/>
					</div>
					<div class="flex items-center space-x-2">
						<input
							id="remember"
							name="remember"
							type="checkbox"
							class="h-4 w-4 rounded border-gray-300"
							disabled={submitting}
						/>
						<Label for="remember" class="!font-normal">Remember me</Label>
					</div>
					<Button type="submit" class="w-full" disabled={submitting}>
						{submitting ? 'Logging in...' : 'Login'}
					</Button>
				</div>
			</form>

			<div class="mt-4 text-center text-sm">
				<a href="/signup" class="text-primary hover:underline">Don't have an account? Sign up</a>
			</div>
		</CardContent>
	</Card>
</div>

