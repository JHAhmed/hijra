<script>
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import Button from '$components/ui/Button.svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { cn } from '$lib/utils.js';

	let { data } = $props();

	// State
	let step = $state(1);
	let selectedPackage = $state(null);
	let loading = $state(false);

	// Filter State
	let activeFilter = $state('all');
	let searchQuery = $state('');

	// Derived Data
	const packages = $derived(data?.packages || []);

	let filteredPackages = $derived(
		packages.filter((pkg) => {
			const matchesType = activeFilter === 'all' ? true : pkg.type.toLowerCase() === activeFilter;
			const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesType && matchesSearch;
		})
	);

	// Helpers
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			maximumFractionDigits: 0
		}).format(amount);
	};

	// Actions
	function handleSelect(pkg) {
		selectedPackage = pkg;
		step = 2;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleBack() {
		step = 1;
		selectedPackage = null;
	}

	async function handleConfirm() {
		loading = true;
		// Simulate a small delay for "Processing Selection"
		setTimeout(() => {
			goto(`/hijrah-portal/application?packageId=${selectedPackage.id}`);
		}, 800);
	}
</script>

<div
	class="min-h-screen w-full bg-white pb-20 text-secondary selection:bg-primary selection:text-white">
	<div class="mx-auto max-w-8xl px-6 py-12 md:px-12 md:py-16">
		<div class="mx-auto mb-12 max-w-4xl text-center">
			<span class="mb-3 block text-xs font-bold tracking-widest text-primary uppercase">
				Step {step} of 2
			</span>
			<h1 class="mb-8 text-3xl font-medium tracking-tighter text-secondary md:text-5xl">
				{step === 1 ? 'Choose your Sacred Path.' : 'Review Package Details.'}
			</h1>

			<div class="flex items-center justify-center gap-4 text-sm font-bold tracking-wide">
				<div
					class={cn(
						'flex items-center gap-2 transition-colors',
						step >= 1 ? 'text-secondary' : 'text-gray-300'
					)}>
					<div
						class={cn(
							'flex h-8 w-8 items-center justify-center rounded-full border-2',
							step >= 1
								? 'border-secondary bg-secondary text-white'
								: 'border-gray-200 text-gray-400'
						)}>
						1
					</div>
					<span>Select</span>
				</div>
				<div class="h-0.5 w-12 bg-gray-200"></div>
				<div
					class={cn(
						'flex items-center gap-2 transition-colors',
						step >= 2 ? 'text-secondary' : 'text-gray-300'
					)}>
					<div
						class={cn(
							'flex h-8 w-8 items-center justify-center rounded-full border-2',
							step >= 2
								? 'border-secondary bg-secondary text-white'
								: 'border-gray-200 text-gray-400'
						)}>
						2
					</div>
					<span>Confirm</span>
				</div>
			</div>
		</div>

		{#if step === 1}
			<div in:fade={{ duration: 300 }}>
				<div
					class="mb-10 flex flex-col items-center justify-between gap-6 rounded-3xl border border-gray-100 bg-gray-50/50 p-4 md:flex-row md:p-6">
					<div class="relative w-full md:w-96">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<Icon icon="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Search by name..."
							class="block w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 text-sm text-secondary placeholder-gray-400 transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none" />
					</div>

					<div class="flex w-full items-center gap-2 overflow-x-auto md:w-auto">
						{#each ['all', 'hajj', 'umrah'] as type}
							<button
								onclick={() => (activeFilter = type)}
								class="rounded-full px-6 py-2.5 text-sm font-bold whitespace-nowrap capitalize transition-all duration-300
                                {activeFilter === type
									? 'bg-secondary text-white shadow-lg shadow-gray-200'
									: 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-white hover:text-secondary'}">
								{type}
							</button>
						{/each}
					</div>
				</div>

				{#if filteredPackages.length > 0}
					<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
						{#each filteredPackages as pkg (pkg.id)}
							<div
								in:fly={{ y: 20, duration: 400 }}
								class="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-2xl hover:shadow-gray-200/50">
								<div class="relative aspect-4/3 overflow-hidden bg-gray-100">
									{#if pkg.image?.url}
										<img
											src={pkg.image.url}
											alt={pkg.name}
											class="h-full w-full object-cover transition-transform duration-700"
											loading="lazy" />
									{:else}
										<div
											class="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
											<Icon icon="ph:image" class="h-12 w-12" />
										</div>
									{/if}
									<div class="absolute top-4 left-4">
										<span
											class="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-wider text-secondary uppercase shadow-sm backdrop-blur-md">
											{pkg.type}
										</span>
									</div>
								</div>

								<div class="flex flex-1 flex-col p-6 md:p-8">
									<div class="mb-4">
										<h3
											class="text-2xl font-bold tracking-tight text-secondary transition-colors group-hover:text-primary">
											{pkg.name}
										</h3>
										<div class="mt-2 flex items-baseline gap-1">
											<span class="text-lg font-bold text-gray-400">from</span>
											<span class="text-2xl font-bold text-secondary"
												>{formatCurrency(pkg.price)}</span>
										</div>
									</div>

									<p class="mb-8 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500">
										{pkg.description}
									</p>

									<div class="mt-auto">
										<Button
											onclick={() => handleSelect(pkg)}
											text="Select Package"
											variant="secondary"
											fullWidth={true} />
									</div>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div
						in:fade
						class="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
						<Icon icon="ph:magnifying-glass" class="mb-4 h-12 w-12 text-gray-300" />
						<h3 class="text-xl font-bold text-secondary">No packages found</h3>
						<p class="mt-2 text-gray-500">Try adjusting your search criteria.</p>
						<button
							onclick={() => {
								searchQuery = '';
								activeFilter = 'all';
							}}
							class="mt-4 text-sm font-bold text-primary hover:underline">Clear filters</button>
					</div>
				{/if}
			</div>
		{/if}

		{#if step === 2 && selectedPackage}
			<div in:fly={{ x: 50, duration: 400 }} class="mx-auto max-w-5xl">
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
					<div class="space-y-8 lg:col-span-2">
						<div
							class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/40">
							<div class="relative h-64 w-full bg-gray-200 md:h-80">
								{#if selectedPackage.image?.url}
									<img
										src={selectedPackage.image.url}
										alt={selectedPackage.name}
										class="h-full w-full object-cover" />
								{/if}
								<div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
								<div class="absolute bottom-6 left-6 md:left-8">
									<span
										class="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">
										{selectedPackage.type}
									</span>
									<h2 class="text-3xl font-bold tracking-tighter text-white md:text-4xl">
										{selectedPackage.name}
									</h2>
								</div>
							</div>

							<div class="p-8">
								<h3 class="mb-4 text-lg font-bold text-secondary">Package Overview</h3>
								<p class="mb-8 leading-relaxed text-gray-500">{selectedPackage.description}</p>

								<h3 class="mb-4 text-lg font-bold text-secondary">What's Included</h3>
								<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
									{#each ['Visa Processing & Fees', 'Round-trip Flights', '5-Star Accommodation', 'Daily Breakfast & Dinner', 'Luxury Transport', 'Guided Ziyarah Tours'] as item}
										<div
											class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
											<Icon
												icon="heroicons:check-circle-solid"
												class="h-5 w-5 shrink-0 text-green-500" />
											<span class="text-sm font-medium text-secondary">{item}</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>

					<div class="lg:col-span-1">
						<div
							class="sticky top-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/40 md:p-8">
							<h3 class="mb-6 text-sm font-bold tracking-widest text-gray-400 uppercase">
								Booking Summary
							</h3>

							<div class="flex items-center justify-between border-b border-gray-100 py-4">
								<span class="text-gray-600">Base Price</span>
								<span class="font-bold text-secondary"
									>{formatCurrency(selectedPackage.price)}</span>
							</div>
							<div class="flex items-center justify-between border-b border-gray-100 py-4">
								<span class="text-gray-600">Per Person</span>
								<span class="font-bold text-secondary">1 Adult</span>
							</div>
							<div class="mb-8 flex items-center justify-between py-4">
								<span class="text-lg font-bold text-secondary">Total Estimate</span>
								<span class="text-2xl font-bold text-primary"
									>{formatCurrency(selectedPackage.price)}</span>
							</div>

							<div class="space-y-3">
								<Button
									onclick={handleConfirm}
									{loading}
									text="Confirm & Apply"
									variant="primary"
									fullWidth={true} />
								<Button
									onclick={handleBack}
									text="Change Package"
									variant="ghost"
									fullWidth={true}
									class="text-gray-400 hover:text-secondary" />
							</div>

							<p class="mt-6 text-center text-xs leading-tight text-gray-400">
								By confirming, you will be redirected to the application form to provide pilgrim
								details. No payment is taken yet.
							</p>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
