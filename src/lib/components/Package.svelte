<script>
	import { Accordion } from 'bits-ui';
	import { slide } from 'svelte/transition';
	import Button from '$components/ui/Button.svelte';
	import Icon from '@iconify/svelte';

	// let {
	// 	travelPackage = {
	// 		name: 'Sample Package',
	// 		image: { url: '' },
	// 		price: 0,
	// 		type: 'standard',
	// 		description: ''
	// 	}
	// } = $props();

	let { travelPackage } = $props();

	export function formatIndian(num) {
		const str = String(Math.round(num));
		if (str.length <= 3) return str;
		const lastThree = str.slice(-3);
		const other = str.slice(0, -3);
		return other.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
	}
</script>

<Accordion.Item value={travelPackage.name} class="group w-full">
	<div
		class="relative flex w-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-500 hover:border-primary hover:shadow-lg md:flex-row">
		<div class="relative h-64 w-full shrink-0 overflow-hidden md:h-auto md:w-72 lg:w-80">
			<div class="absolute inset-0 bg-gray-200">
				{#if travelPackage.image?.url}
					<img
						src={travelPackage.image.url}
						alt={travelPackage.name}
						loading="lazy"
						class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
				{/if}
			</div>

			<div class="absolute top-4 left-4">
				<span
					class="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-wide text-secondary capitalize backdrop-blur-md">
					{travelPackage.type}
				</span>
			</div>
		</div>

		<div class="flex flex-1 flex-col justify-between p-6 md:p-8">
			<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div>
					<h3 class="text-2xl font-bold tracking-tight text-secondary md:text-3xl">
						{travelPackage.name}
					</h3>
					<p class="mt-2 text-base leading-relaxed text-gray-500">
						{travelPackage.description}
					</p>
				</div>

				<div class="flex shrink-0 flex-col items-start md:items-end">
					<span class="text-sm font-bold tracking-widest text-gray-400 uppercase"
						>Starting From</span>
					<div class="flex items-baseline gap-1 text-primary">
						<span class="text-lg font-bold">₹</span>
						<span class="text-2xl font-semibold tracking-tighter md:text-3xl"
							>{formatIndian(travelPackage.price)}</span>
					</div>
				</div>
			</div>

			<div class="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
				<div class="flex gap-4 text-gray-400">
					<div class="flex items-center gap-1.5" title="Flights Included">
						<Icon icon="heroicons:paper-airplane" class="h-5 w-5" />
						<span class="text-xs font-medium">Flights</span>
					</div>
					<div class="flex items-center gap-1.5" title="Visa Included">
						<Icon icon="heroicons:document-text" class="h-5 w-5" />
						<span class="text-xs font-medium">Visa</span>
					</div>
					<div class="flex items-center gap-1.5" title="5 Star Hotels">
						<Icon icon="heroicons:building-office-2" class="h-5 w-5" />
						<span class="text-xs font-medium">Hotels</span>
					</div>
				</div>

				<Accordion.Trigger
					class="group/btn flex items-center gap-2 text-sm font-bold tracking-wide text-secondary uppercase transition-colors hover:text-primary focus:outline-none">
					<!-- <span>{open ? 'Hide Details' : 'View Itinerary'}</span> -->
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all duration-300 group-hover/btn:border-primary group-hover/btn:bg-primary group-hover/btn:text-white">
						<Icon
							icon="heroicons:chevron-down"
							class="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-180" />
					</div>
				</Accordion.Trigger>
			</div>

			<Accordion.Content forceMount={true} class="overflow-hidden">
				{#snippet child({ props, open })}
					{#if open}
						<div {...props} transition:slide={{ duration: 300, axis: 'y' }}>
							<div class="mt-6 rounded-2xl bg-gray-50 p-6 md:p-8">
								<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
									<div>
										<h4 class="mb-4 text-sm font-bold tracking-widest text-secondary uppercase">
											Package Highlights
										</h4>
										<ul class="space-y-3">
											<li class="flex items-start gap-3 text-sm text-gray-600">
												<Icon
													icon="heroicons:check-circle"
													class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
												<span>Round trip economy class flights</span>
											</li>
											<li class="flex items-start gap-3 text-sm text-gray-600">
												<Icon
													icon="heroicons:check-circle"
													class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
												<span>Luxury accommodation near Haram</span>
											</li>
											<li class="flex items-start gap-3 text-sm text-gray-600">
												<Icon
													icon="heroicons:check-circle"
													class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
												<span>Buffet breakfast and dinner included</span>
											</li>
											<li class="flex items-start gap-3 text-sm text-gray-600">
												<Icon
													icon="heroicons:check-circle"
													class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
												<span>Complete Ziyarah tour with guide</span>
											</li>
										</ul>
									</div>

									<div
										class="flex flex-col justify-between border-t border-gray-200 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
										<div>
											<h4 class="mb-2 text-sm font-bold tracking-widest text-secondary uppercase">
												Ready to book?
											</h4>
											<p class="text-sm text-gray-500">
												Slots fill up quickly for this season. Reserve your spot with a deposit
												today.
											</p>
										</div>
										<div class="mt-6">
											<Button
												href="/contact"
												text="Book This Package"
												class="w-full justify-center"
												size="lg" />
										</div>
									</div>
								</div>
							</div>
						</div>
					{/if}
				{/snippet}
			</Accordion.Content>
		</div>
	</div>
</Accordion.Item>
