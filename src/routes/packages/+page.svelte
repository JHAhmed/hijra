<script>
	import { Accordion } from 'bits-ui';
	import { onMount } from 'svelte';
	import Dropdown from '$components/ui/Dropdown.svelte'; // Assuming this path
	import Package from '$components/Package.svelte'; // Assuming this path
	import Button from '$components/ui/Button.svelte';

	// Mock data for display purposes (replace with your actual data loader)
	let packageTypes = [
		{ value: 'all', label: 'All Journeys' },
		{ value: 'hajj', label: 'Hajj Packages' },
		{ value: 'umrah', label: 'Umrah Packages' }
	];

	let selectedPackage = $state('all');

	// Assuming you pass data via data prop or load it here
	let { data } = $props();

	let packages = data?.packages || [];

	console.log(packages);

	let filteredPackages = $derived(
		selectedPackage === 'all' ? packages : packages.filter((p) => p.type === selectedPackage)
	);
</script>

<div
	class="relative min-h-screen w-full bg-white text-secondary selection:bg-primary selection:text-white">
	<section
		class="relative z-10 mx-auto flex w-full max-w-8xl flex-col items-center justify-center px-6 py-12 text-center md:py-16">
		<div
			class="animate-fade-in-up mb-8 inline-flex translate-y-4 items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-2.5 opacity-0">
			<div class="flex items-center gap-2">
				<div class="h-1.5 w-1.5 rounded-full bg-primary"></div>
				<span class="text-sm font-bold tracking-widest text-secondary uppercase">2026</span>
			</div>
			<span class="h-3.5 w-px bg-gray-200"></span>
			<span class="text-sm font-medium text-gray-500">Bookings Open</span>
		</div>

		<h1
			class="animate-fade-in-up mb-8 translate-y-4 text-5xl leading-tight text-secondary opacity-0 delay-100 md:text-7xl lg:text-8xl">
			<span class="block font-normal tracking-tight">Curated</span>
			<span class="-mt-2 block font-light tracking-tighter text-primary md:-mt-4">
				Spiritual Paths.
			</span>
		</h1>

		<p
			class="animate-fade-in-up mx-auto mb-12 max-w-2xl translate-y-4 text-lg leading-relaxed font-normal text-gray-500 opacity-0 delay-200 md:text-xl">
			Whether you seek the profound obligation of Hajj or the serene devotion of Umrah, our packages
			are designed to provide comfort, proximity, and peace of mind.
		</p>

		<div class="animate-fade-in-up w-full max-w-sm translate-y-4 opacity-0 delay-300">
			<Dropdown
				label="Filter by Journey"
				name="package-type"
				items={packageTypes}
				bind:value={selectedPackage}
				class="w-full bg-white shadow-primary/10" />
			<p class="mt-4 text-xs font-medium tracking-wide text-gray-400 uppercase">
				Showing {filteredPackages.length}
				{filteredPackages.length === 1 ? 'Package' : 'Packages'}
			</p>
		</div>
	</section>

	<section
		class="relative z-10 w-full border-t border-gray-100 bg-white/50 px-6 py-20 backdrop-blur-sm md:px-12">
		<div class="mx-auto max-w-5xl">
			<Accordion.Root type="multiple" class="flex flex-col gap-6 md:gap-8">
				{#each filteredPackages as travelPackage}
					<Package {travelPackage} />
				{/each}

				{#if filteredPackages.length === 0}
					<div class="py-20 text-center">
						<p class="text-xl text-gray-400">No packages found for this category.</p>
					</div>
				{/if}
			</Accordion.Root>
		</div>
	</section>

	<section class="border-t border-gray-100 bg-white py-24 text-center">
		<div class="mx-auto max-w-4xl px-6">
			<p class="mb-4 text-sm font-bold tracking-[0.2em] text-primary uppercase">Custom Requests</p>
			<h2 class="text-3xl font-medium tracking-tight text-secondary md:text-5xl">
				Need a tailored itinerary?
			</h2>
			<p class="mx-auto mt-6 max-w-xl text-gray-500">
				We understand that every family has unique needs. Contact our experts to build a custom
				package.
			</p>
			<Button text="Contact Us" href="/contact" variant="primary" class="mt-6" />
		</div>
	</section>
</div>

<style>
	/* Reusing the animation logic from your Landing Page */
	.animate-fade-in-up {
		animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.delay-100 {
		animation-delay: 0.1s;
	}
	.delay-200 {
		animation-delay: 0.2s;
	}
	.delay-300 {
		animation-delay: 0.3s;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
