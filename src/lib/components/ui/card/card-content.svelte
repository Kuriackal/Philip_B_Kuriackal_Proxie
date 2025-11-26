<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		class?: string;
	}

	let { class: className = '', children, ...restProps }: Props & { children?: any } = $props();
</script>

<div class={cn('p-6 pt-0', className)} {...restProps}>
	{@render children()}
</div>

