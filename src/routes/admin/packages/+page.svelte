<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Modal from '$components/ui/Modal.svelte';
	import Button from '$components/ui/Button.svelte';
	import { getFileUrl } from '$lib/appwrite';

	let isLoading = $state(true);
	let packages = $state([]);
	let total = $state(0);
	let currentPage = $state(1);
	let typeFilter = $state('');
	const limit = 20;

	/**
	 * Get type badge styling
	 */
	function getTypeStyle(type) {
		const styles = {
			Hajj: 'bg-emerald-50 text-emerald-600',
			Umrah: 'bg-blue-50 text-blue-600'
		};
		return styles[type] || 'bg-gray-50 text-gray-500';
	}

	/**
	 * Format currency
	 */
	function formatPrice(amount) {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			maximumFractionDigits: 0
		}).format(amount);
	}

	/**
	 * Fetch packages from API
	 */
	async function fetchPackages() {
		try {
			const offset = (currentPage - 1) * limit;
			let url = `/api/admin/packages?limit=${limit}&offset=${offset}`;
			if (typeFilter) {
				url += `&type=${typeFilter}`;
			}

			const response = await fetch(url);
			const result = await response.json();

			if (result.success) {
				packages = result.packages;
				total = result.total;
			}
		} catch (error) {
			console.error('Failed to fetch packages:', error);
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Handle filter change
	 */
	function handleFilterChange() {
		currentPage = 1;
		isLoading = true;
		fetchPackages();
	}

	/**
	 * Handle pagination
	 */
	function goToPage(page) {
		currentPage = page;
		isLoading = true;
		fetchPackages();
	}

	// Calculate total pages
	const totalPages = $derived(Math.ceil(total / limit));

	onMount(() => {
		fetchPackages();
	});
</script>

{#if isLoading}
	<Modal text="Loading packages..." />
{/if}

<div class="mx-auto w-full max-w-10xl space-y-8 p-6 md:p-10" in:fade={{ duration: 500 }}>
	<!-- Header -->
	<div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
		<div class="space-y-1">
			<span class="text-xs font-bold tracking-widest text-gray-400 uppercase">Management</span>
			<h1 class="text-3xl font-medium tracking-tighter text-secondary md:text-4xl">Packages</h1>
		</div>

		<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
			<!-- Type Filter -->
			<select
				bind:value={typeFilter}
				onchange={handleFilterChange}
				class="h-10 w-full sm:w-auto rounded-full border border-gray-200 bg-white px-4 text-sm text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
				<option value="">All Types</option>
				<option value="Hajj">Hajj</option>
				<option value="Umrah">Umrah</option>
			</select>

			<Button href="/admin/packages/new" variant="primary" text="Create Package" size="sm" class="w-full sm:w-auto" />
		</div>
	</div>

	<!-- Stats Summary -->
	<div class="flex items-center gap-4">
		<div class="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2">
			<Icon icon="heroicons:cube" class="h-4 w-4 text-gray-500" />
			<span class="text-sm font-medium text-secondary">{total} Packages</span>
		</div>
	</div>

	<!-- Packages Table -->
	<div class="overflow-hidden rounded-4xl border border-gray-100 bg-white">
		{#if packages.length === 0 && !isLoading}
			<!-- Empty State -->
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
					<Icon icon="heroicons:cube" class="h-8 w-8 text-gray-300" />
				</div>
				<h3 class="mb-2 text-xl font-bold text-secondary">No Packages Found</h3>
				<p class="max-w-md text-gray-500">
					{typeFilter
						? 'No packages match the selected type.'
						: 'Create your first package to start offering travel options.'}
				</p>
				<Button
					href="/admin/packages/new"
					variant="primary"
					text="Create First Package"
					size="sm"
					class="mt-4" />
			</div>
		{:else}
			<!-- Table Header -->
			<div
				class="hidden border-b border-gray-100 bg-gray-50/50 px-6 py-4 text-xs font-bold tracking-wider text-gray-400 uppercase md:grid md:grid-cols-12">
				<div class="col-span-4">Package</div>
				<div class="col-span-2">Type</div>
				<div class="col-span-2">Price</div>
				<div class="col-span-2">Duration</div>
				<div class="col-span-1">Status</div>
				<div class="col-span-1 text-right">Actions</div>
			</div>

			<!-- Table Rows -->
			{#each packages as pkg}
				<div class="border-b border-gray-50 last:border-0">
					<div
						class="flex flex-col gap-4 px-6 py-5 md:grid md:grid-cols-12 md:items-center md:gap-0">
						<!-- Package Name & Image -->
						<a href="/admin/packages/{pkg.$id}" class="group col-span-4 flex items-center gap-4">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
								{#if pkg.imageId}
									<img src={getFileUrl(pkg.imageId)} alt={pkg.name} class="h-full w-full object-cover" />
								{:else}
									<Icon icon="heroicons:photo" class="h-5 w-5 text-gray-300" />
								{/if}
							</div>
							<div>
								<h3 class="font-medium text-secondary group-hover:text-primary">
									{pkg.name}
								</h3>
								<p class="text-xs text-gray-400 line-clamp-1">{pkg.description || 'No description'}</p>
							</div>
						</a>

						<!-- Type -->
						<div class="col-span-2">
							<span
								class="inline-flex rounded-full px-3 py-1 text-xs font-bold {getTypeStyle(pkg.type)}">
								{pkg.type}
							</span>
						</div>

						<!-- Price -->
						<div class="col-span-2">
							<p class="text-sm font-medium text-secondary">{formatPrice(pkg.price)}</p>
						</div>

						<!-- Duration -->
						<div class="col-span-2">
							<p class="text-sm text-gray-600">{pkg.duration || '-'}</p>
						</div>

						<!-- Status -->
						<div class="col-span-1">
							{#if pkg.isActive}
								<span class="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
									<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
									Active
								</span>
							{:else}
								<span class="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
									<span class="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
									Inactive
								</span>
							{/if}
						</div>

						<!-- Actions -->
						<div class="col-span-1 flex justify-end gap-2">
							<a
								href="/admin/packages/{pkg.$id}"
								class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-primary hover:text-white">
								<Icon icon="heroicons:chevron-right" class="h-4 w-4" />
							</a>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<p class="text-sm text-gray-500 text-center sm:text-left">
				Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)} of {total}
				packages
			</p>
			<div class="flex items-center justify-center gap-2">
				<button
					onclick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
					class="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
					<Icon icon="heroicons:chevron-left" class="h-4 w-4" />
				</button>
				{#each Array(Math.min(5, totalPages)) as _, i}
					{@const pageNum = i + 1}
					<button
						onclick={() => goToPage(pageNum)}
						class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors
                        {currentPage === pageNum
							? 'bg-primary text-white'
							: 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}">
						{pageNum}
					</button>
				{/each}
				<button
					onclick={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					class="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
					<Icon icon="heroicons:chevron-right" class="h-4 w-4" />
				</button>
			</div>
		</div>
	{/if}
</div>
