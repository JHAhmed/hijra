<script>
	import { Accordion } from 'bits-ui';
	import { slide } from 'svelte/transition';
	import Button from './ui/Button.svelte';
	import Icon from '@iconify/svelte';

	// prefer explicit prop style
	export let travelPackage = {
		name: 'Sample Package',
		image: { url: '' },
		price: 0,
		type: 'standard',
		description: ''
	};

	export function formatIndian(num) {
		const str = String(Math.round(num));
		if (str.length <= 3) return str;
		const lastThree = str.slice(-3);
		const other = str.slice(0, -3);
		return other.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
	}

	function toTitleCase(s = '') {
		return String(s)
			.toLowerCase()
			.split(' ')
			.filter(Boolean)
			.map((w) => w[0].toUpperCase() + w.slice(1))
			.join(' ');
	}

	function excerpt(text = '', len = 140) {
		if (!text) return '';
		return text.length <= len ? text : text.slice(0, len).trimEnd() + '...';
	}
</script>

<Accordion.Item value={travelPackage.name} class="w-full">
	<div
		class="group flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-transform md:flex-row md:items-stretch">
		<!-- Image column -->
		<div
			class="relative h-44 w-full shrink-0 overflow-hidden rounded-t-2xl md:h-auto md:w-44 md:rounded-l-2xl md:rounded-tr-none">
			<img
				src={travelPackage.image?.url}
				alt={travelPackage.name ? `Image — ${travelPackage.name}` : 'package image'}
				loading="lazy"
				class="h-full w-full object-cover object-center" />
			<div
				class="absolute top-3 left-3 rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
				{toTitleCase(travelPackage.type)}
			</div>
		</div>

		<!-- Content column -->
		<div class="flex w-full flex-col gap-3 p-4 md:flex-1">
			<div class="flex items-start justify-between gap-3">
				<div class="min-w-0">
					<h3 class="truncate text-base leading-tight font-semibold text-slate-900">
						{travelPackage.name}
					</h3>
					<p class="mt-1 text-sm text-slate-500">{excerpt(travelPackage.description, 120)}</p>
				</div>

				<div class="flex shrink-0 flex-col items-end gap-2">
					<div
						class="rounded-md bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 ring-1 ring-green-50">
						<p>
							₹{formatIndian(travelPackage.price)}<span class="text-xs font-medium text-slate-500"
								>/pax</span>
						</p>
					</div>

					<!-- <Accordion.Trigger
						class="focus-visible:ring-primary-300 inline-flex w-full items-center gap-2 rounded-md border border-transparent bg-primary px-3 py-1 text-sm font-medium text-white transition hover:bg-primary focus:outline-none focus-visible:ring-2">
						Details
						<Icon
							icon="mdi:chevron-down"
							class="ml-auto h-4 w-4 transition-transform duration-200 [.group[data-state=open]_&]:rotate-45" />
					</Accordion.Trigger> -->
				</div>
			</div>

			<!-- Hidden during closed state; accessible when open -->
			<Accordion.Content
				forceMount={true}
				class="overflow-hidden transition-all data-closed:max-h-0 data-open:max-h-96">
				{#snippet child({ props, open })}
					<!-- {#if open} -->
					<div {...props} transition:slide={{ duration: 200 }}>
						<div
							class="mt-3 flex flex-col gap-3 border-t border-gray-100 pt-3 text-sm text-slate-600 md:flex-row md:items-start">
							<div class="md:w-2/3">
								<p class="leading-relaxed">{travelPackage.description}</p>
							</div>

							<div class="flex flex-col gap-2 md:w-1/3">
								<div class="rounded-md bg-gray-50 p-3 text-xs text-slate-700">
									<div class="font-medium">Inclusions</div>
									<ul class="mt-1 list-inside list-disc">
										<li>Accommodation</li>
										<li>Breakfast</li>
										<li>Local transfers</li>
									</ul>
								</div>

								<div
									class="flex items-center justify-between rounded-md bg-white p-2 text-xs text-slate-500 ring-1 ring-gray-50">
									<span>Duration</span>
									<span class="font-medium text-slate-700">3 days</span>
								</div>

								<div class="mt-1">
									<Button href="/contact" variant="primary" text="Book Now" class="w-full" />
								</div>
							</div>
						</div>
					</div>
					<!-- {/if} -->
				{/snippet}
			</Accordion.Content>
		</div>
	</div>
</Accordion.Item>
