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
	let validationErrors = $state<Record<string, string>>({});
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
	<Card class="w-full max-w-md">
		<CardHeader>
			<CardTitle>Sign Up</CardTitle>
			<CardDescription>Create a new account to get started</CardDescription>
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
				action="?/signup"
				use:enhance={() => {
					submitting = true;
					error = null;
					success = null;
					validationErrors = {};
					return async ({ update, result }) => {
						if (result.type === 'failure' && result.data?.validationErrors) {
							validationErrors = result.data.validationErrors as Record<string, string>;
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
						{#if validationErrors.email}
							<p class="text-sm text-destructive">{validationErrors.email}</p>
						{/if}
					</div>
					<div class="space-y-2">
						<Label for="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							required
							disabled={submitting}
							minLength={6}
						/>
						{#if validationErrors.password}
							<p class="text-sm text-destructive">{validationErrors.password}</p>
						{/if}
						<p class="text-xs text-muted-foreground">
							Password must be at least 6 characters long
						</p>
					</div>
					<div class="space-y-2">
						<Label for="confirmPassword">Confirm Password</Label>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							required
							disabled={submitting}
						/>
						{#if validationErrors.confirmPassword}
							<p class="text-sm text-destructive">{validationErrors.confirmPassword}</p>
						{/if}
					</div>
					<Button type="submit" class="w-full" disabled={submitting}>
						{submitting ? 'Creating account...' : 'Sign Up'}
					</Button>
				</div>
			</form>

			<div class="mt-4 text-center text-sm">
				<a href="/login" class="text-primary hover:underline">Already have an account? Login</a>
			</div>
		</CardContent>
	</Card>
</div>

