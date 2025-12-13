<script>
	import { scale } from 'svelte/transition';
	import { cn } from '$lib';
	let { closeDialog = () => {}, children, class: className } = $props();
</script>

<dialog
	onclick={closeDialog}
	class="fixed inset-0 z-100 flex h-screen w-screen items-center justify-center bg-black/40 backdrop-blur-sm">
	<div
		in:scale={{ duration: 200, start: 0.5 }}
		class={cn(
			'relative mx-8 flex w-full max-w-md hard-shadow-md flex-col items-center justify-center gap-2 rounded-2xl border-4 border-black bg-amber-50 p-6',
			className
		)}>
		{@render children?.()}
	</div>
</dialog>
