<script>
	import Dropdown from '$components/ui/Dropdown.svelte';
	import { toTitleCase } from '$lib/utils.js';
	import { onMount } from 'svelte';

	let { data } = $props();
	let selectedPackage = $state(null);
	let selectedType = $state('all');

	onMount(() => {
		console.log('Packages Data:', data.packages);
	});

	let packageTypes = $derived.by(() => {
		let uniqueTypes = ['all', ...new Set(data.packages.map((pkg) => pkg.type))].sort();
		return uniqueTypes.map((type) => ({
			value: type,
			label: toTitleCase(type)
		}));
	});

	$effect(() => {
		console.log('Package Types:', selectedType);
	});

	let finalPackages = $derived.by(() => {
		return data.packages;
	});

	function selectPackage(packageId) {
		console.log('Selected package ID:', packageId);
	}
</script>

<div class="space-y-8 rounded-2xl bg-gray-50 p-4 md:p-8">
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<h2 class="text-xl font-medium tracking-tight text-gray-800 md:text-3xl">
			University Selection
		</h2>

		<!-- Country Filter Dropdown -->
		<div class="w-full sm:w-64">
			<Dropdown
				bind:value={selectedType}
				class="w-full"
				items={packageTypes}
				placeholder="Filter by Package Type" />

			<!-- <label for="country-filter" class="sr-only">Filter by Country</label>
            <select
                id="country-filter"
                bind:value={selectedPackage}
                class="w-full rounded-lg border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option value="all">All Countries ({universities.length})</option>
                {#each uniqueCountries as country}
                    <option value={country}>
                        {country} ({universities.filter(u => u.country === country).length})
                    </option>
                {/each}
            </select> -->
		</div>
	</div>

	{#if finalPackages.length === 0}
		<div class="py-12 text-center">
			<Icon icon="heroicons:magnifying-glass" class="mx-auto mb-4 size-12 text-gray-400" />
			<p class="text-gray-600">No universities found for the selected country.</p>
		</div>
	{:else}
		<p class="text-sm text-gray-600">
			Showing {finalPackages.length}
			{finalPackages.length === 1 ? 'university' : 'universities'}
		</p>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each finalPackages as pkg}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div
					class="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-400 bg-white p-4 hover:bg-gray-100 md:p-6"
					onclick={() => selectPackage(pkg.id)}>
					<div
						class="flex h-full w-full grow flex-col items-center justify-start space-y-4 md:flex-row md:space-y-0 md:space-x-4">
						<div class="h-24 w-24">
							<img
								src={pkg.image.url}
								alt={pkg.name}
								class="mb-2 h-24 w-24 rounded-lg object-cover md:mb-0" />
						</div>

						<div class="flex flex-col space-y-2">
							<p class=" text-center md:text-left">{pkg.name}</p>
							<p class="text-center text-sm text-gray-600 md:text-left">{toTitleCase(pkg.type)}</p>
							<!-- <p class="text-sm text-gray-600  text-center md:text-left">{pkg.type.join(', ').toUpperCase()}</p> -->
						</div>
					</div>

					<div class="my-4 h-px w-full bg-gray-400 px-4"></div>

					<div class="flex w-full grow flex-col items-center justify-start md:flex-row">
						<div class="flex grow items-center justify-start">
							<div class="mx-2 flex h-4 w-0.5 bg-gray-300"></div>
							<p class="py-1 text-center text-sm text-gray-600 md:text-left">
								Tuition Fees: <span class="text-black">₽{pkg.price.toLocaleString()}</span>
							</p>
						</div>

						<!-- <div class="rounded-full {shortlisted.includes(pkg.id) ? "hidden" : ""} border-2 cursor-pointer border-green-300 p-1 px-3 text-xs mt-4 md:mt-0">
                            <p class="tracking-tight text-gray-800 z-50">Shortlist</p>
                        </div>

                        {#if shortlisted.includes(pkg.id)}
                            <div class="rounded-full bg-green-300 p-1 px-3 text-xs mt-4 md:mt-0">
                                <p class="tracking-tight text-gray-800">Shortlisted</p>
                            </div>
                        {/if} -->
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
