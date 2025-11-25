<script>
	import Icon from '@iconify/svelte';
	import Button from '$components/ui/Button.svelte';
	import { cn } from '$lib/utils.js';

	let { card } = $props();
</script>

<a
	href={card.visible ? card.url : '/hijrah-portal'}
	class={cn(
		'group relative flex cursor-default flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300',
		card.visible && 'cursor-pointer hover:border-primary ',
		!card.visible && 'pointer-events-none opacity-60'
	)}>
	<div class="relative h-48 overflow-hidden bg-gray-100">
		<img
			src={card.image}
			alt={card.text}
			class="h-full w-full object-cover transition-transform duration-500"
			loading="lazy" />

		<div class="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>

		{#if card.icon}
			<div
				class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:bg-white">
				<Icon
					icon={card.icon}
					class="h-5 w-5 text-white transition-colors duration-300 group-hover:text-black" />
			</div>
		{/if}

		{#if !card.visible}
			<div
				class="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/95 px-3 py-1.5 backdrop-blur-sm">
				<Icon icon="heroicons:lock-closed" class="h-3.5 w-3.5 text-gray-500" />
				<span class="text-xs font-bold text-gray-600">Locked</span>
			</div>
		{/if}
	</div>

	<div class="flex flex-1 flex-col p-6">
		<div class="mb-4 flex items-center gap-2">
			<span class="h-1.5 w-1.5 rounded-full {card.visible ? 'bg-primary' : 'bg-gray-400'}"></span>
			<span class="text-xs font-bold tracking-widest text-gray-400 uppercase">
				{card.visible ? 'Available Now' : 'Coming Soon'}
			</span>
		</div>

		<h3
			class="mb-3 text-xl font-bold tracking-tight text-secondary transition-colors group-hover:text-black">
			{card.text}
		</h3>

		<p class="flex-1 text-sm leading-relaxed text-gray-500">
			{card.description}
		</p>

		{#if card.visible}
			<div class="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
				<Button text="Continue" variant="secondary" size="sm" href={card.url} />

				<!-- <span class="flex items-center gap-1.5 text-xs font-medium text-primary">
					<Icon icon="heroicons:check-circle-16-solid" class="h-4 w-4" />
					Ready
				</span> -->
			</div>
		{:else}
			<div class="mt-6 border-t border-gray-100 pt-4">
				<span class="text-xs text-gray-400"> Complete previous modules to unlock </span>
			</div>
		{/if}
	</div>
</a>
