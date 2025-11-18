<script>
	import Icon from '@iconify/svelte';
	import Button from '$components/ui/Button.svelte';

	let { card } = $props();
</script>

<a
	href={card.visible ? card.url : '/student-portal'}
	class="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg/5 ring-1 ring-gray-200 transition-all duration-300"
	class:opacity-50={!card.visible}
	class:pointer-events-none={!card.visible}>
	<div class="relative h-56 overflow-hidden">
		<img
			src={card.image}
			alt={card.text}
			class="h-full w-full object-cover transition-transform duration-500"
			loading="lazy" />
		<div class="absolute inset-0 bg-linear-to-b from-transparent to-black/30"></div>

		{#if card.icon}
			<div
				class="absolute top-4 right-4 rounded-full bg-white/20 p-3 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:bg-white">
				<Icon
					icon={card.icon}
					class="h-5 w-5 text-white transition-colors duration-300 group-hover:text-black" />
			</div>
		{/if}

		{#if !card.visible}
			<div
				class="absolute top-4 left-4 rounded-full bg-gray-900/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
				Unavailable
			</div>
		{/if}
	</div>

	<div class="flex flex-1 flex-col p-6">
		<h3 class="mb-1 text-xl font-semibold tracking-tight">{card.text}</h3>
		<p class="grow text-sm text-gray-600">{card.description}</p>

		<div class="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
			<Button
				text="Continue"
				variant="secondary"
				size="sm"
                class={card.visible ? '' : 'hidden'}
				icon="heroicons:arrow-right-16-solid"
				iconPos="right"
				href={card.visible ? card.url : '/student-portal'} />

			<span class="flex items-center text-xs {card.visible ? 'text-green-600' : 'text-gray-500'}">
				<span class="h-2 w-2 rounded-full {card.visible ? 'bg-green-500' : 'bg-gray-400'} mr-2"
				></span>
				{card.visible ? 'Available' : 'Locked'}
			</span>
		</div>
	</div>
</a>
