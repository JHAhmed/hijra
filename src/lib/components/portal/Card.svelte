<script>
	import Icon from '@iconify/svelte';
	import Button from '$components/ui/Button.svelte';
	import { cn } from '$lib/utils.js';

	let { card } = $props();

	// Card states:
	// - locked: visible=false (cannot access, step not yet reached)
	// - current: visible=true, completed=false (can work on this step)
	// - completed: visible=true, completed=true (done, read-only)
</script>

<a
	href={card.visible ? card.url : '/hijrah-portal'}
	class={cn(
		'group relative flex cursor-default flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300',
		card.visible && !card.completed && 'cursor-pointer border-primary/30 hover:border-primary hover:shadow-lg',
		card.visible && card.completed && 'cursor-pointer border-green-200 bg-green-50/30',
		!card.visible && 'pointer-events-none border-gray-200 opacity-60'
	)}>
	<div class="relative h-48 overflow-hidden bg-gray-100">
		<img
			src={card.image}
			alt={card.text}
			class={cn(
				'h-full w-full object-cover transition-transform duration-500',
				card.completed && 'opacity-80'
			)}
			loading="lazy" />

		<div class="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>

		{#if card.icon}
			<div
				class={cn(
					'absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300',
					card.completed 
						? 'border-green-300 bg-green-500 text-white' 
						: card.visible 
							? 'border-white/20 bg-white/10 group-hover:bg-white' 
							: 'border-white/20 bg-white/10'
				)}>
				{#if card.completed}
					<Icon icon="heroicons:check" class="h-5 w-5" />
				{:else}
					<Icon
						icon={card.icon}
						class={cn(
							'h-5 w-5 transition-colors duration-300',
							card.visible ? 'text-white group-hover:text-black' : 'text-white'
						)} />
				{/if}
			</div>
		{/if}

		{#if !card.visible}
			<div
				class="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/95 px-3 py-1.5 backdrop-blur-sm">
				<Icon icon="heroicons:lock-closed" class="h-3.5 w-3.5 text-gray-500" />
				<span class="text-xs font-bold text-gray-600">Locked</span>
			</div>
		{:else if card.completed}
			<div
				class="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-green-300 bg-green-500 px-3 py-1.5">
				<Icon icon="heroicons:check-circle-solid" class="h-3.5 w-3.5 text-white" />
				<span class="text-xs font-bold text-white">Completed</span>
			</div>
		{/if}
	</div>

	<div class="flex flex-1 flex-col p-6">
		<div class="mb-4 flex items-center gap-2">
			<span class={cn(
				'h-1.5 w-1.5 rounded-full',
				card.completed ? 'bg-green-500' : card.visible ? 'bg-primary' : 'bg-gray-400'
			)}></span>
			<span class="text-xs font-bold tracking-widest text-gray-400 uppercase">
				{#if card.completed}
					Completed
				{:else if card.visible}
					Available Now
				{:else}
					Coming Soon
				{/if}
			</span>
		</div>

		<h3
			class={cn(
				'mb-3 text-xl font-bold tracking-tight transition-colors',
				card.completed ? 'text-green-700' : 'text-secondary group-hover:text-black'
			)}>
			{card.text}
		</h3>

		<p class="flex-1 text-sm leading-relaxed text-gray-500">
			{card.description}
		</p>

		{#if card.visible}
			<div class="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
				{#if card.completed}
					<Button text="View Details" variant="ghost" size="sm" href={card.url} />
					<span class="flex items-center gap-1.5 text-xs font-medium text-green-600">
						<Icon icon="heroicons:check-circle-16-solid" class="h-4 w-4" />
						Done
					</span>
				{:else}
					<Button text="Continue" variant="secondary" size="sm" href={card.url} />
				{/if}
			</div>
		{:else}
			<div class="mt-6 border-t border-gray-100 pt-4">
				<span class="text-xs text-gray-400"> Complete previous modules to unlock </span>
			</div>
		{/if}
	</div>
</a>

