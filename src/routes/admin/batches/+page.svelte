<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Modal from '$components/ui/Modal.svelte';
	import Button from '$components/ui/Button.svelte';

	let isLoading = $state(true);
	let batches = $state([]);
	let total = $state(0);
	let currentPage = $state(1);
	let statusFilter = $state('');
	const limit = 20;

	/**
	 * Get status badge styling
	 */
	function getStatusStyle(status) {
		const styles = {
			draft: 'bg-gray-100 text-gray-600',
			open: 'bg-emerald-50 text-emerald-600',
			closed: 'bg-amber-50 text-amber-600',
			in_progress: 'bg-blue-50 text-blue-600',
			completed: 'bg-purple-50 text-purple-600'
		};
		return styles[status] || 'bg-gray-50 text-gray-500';
	}

	/**
	 * Format status for display
	 */
	function formatStatus(status) {
		if (!status) return 'Unknown';
		return status
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	/**
	 * Format date
	 */
	function formatDate(dateString) {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	/**
	 * Fetch batches from API
	 */
	async function fetchBatches() {
		try {
			const offset = (currentPage - 1) * limit;
			let url = `/api/admin/batches?limit=${limit}&offset=${offset}`;
			if (statusFilter) {
				url += `&status=${statusFilter}`;
			}

			const response = await fetch(url);
			const result = await response.json();

			if (result.success) {
				batches = result.batches;
				total = result.total;
			}
		} catch (error) {
			console.error('Failed to fetch batches:', error);
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Handle status filter change
	 */
	function handleFilterChange() {
		currentPage = 1;
		isLoading = true;
		fetchBatches();
	}

	/**
	 * Handle pagination
	 */
	function goToPage(page) {
		currentPage = page;
		isLoading = true;
		fetchBatches();
	}

	// Calculate total pages
	const totalPages = $derived(Math.ceil(total / limit));

	onMount(() => {
		fetchBatches();
	});
</script>

{#if isLoading}
	<Modal text="Loading batches..." />
{/if}

<div class="mx-auto w-full max-w-10xl space-y-8 p-6 md:p-10" in:fade={{ duration: 500 }}>
	<!-- Header -->
	<div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
		<div class="space-y-1">
			<span class="text-xs font-bold tracking-widest text-gray-400 uppercase">Management</span>
			<h1 class="text-3xl font-medium tracking-tighter text-secondary md:text-4xl">Batches</h1>
		</div>

		<div class="flex items-center gap-3">
			<!-- Status Filter -->
			<select
				bind:value={statusFilter}
				onchange={handleFilterChange}
				class="h-10 rounded-full border border-gray-200 bg-white px-4 text-sm text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
				<option value="">All Statuses</option>
				<option value="draft">Draft</option>
				<option value="open">Open</option>
				<option value="closed">Closed</option>
				<option value="in_progress">In Progress</option>
				<option value="completed">Completed</option>
			</select>

			<Button href="/admin/batches/new" variant="primary" text="Create Batch" size="sm" />
		</div>
	</div>

	<!-- Stats Summary -->
	<div class="flex items-center gap-4">
		<div class="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2">
			<Icon icon="heroicons:rectangle-stack" class="h-4 w-4 text-gray-500" />
			<span class="text-sm font-medium text-secondary">{total} Batches</span>
		</div>
	</div>

	<!-- Batches Table -->
	<div class="overflow-hidden rounded-4xl border border-gray-100 bg-white">
		{#if batches.length === 0 && !isLoading}
			<!-- Empty State -->
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
					<Icon icon="heroicons:rectangle-stack" class="h-8 w-8 text-gray-300" />
				</div>
				<h3 class="mb-2 text-xl font-bold text-secondary">No Batches Found</h3>
				<p class="max-w-md text-gray-500">
					{statusFilter
						? 'No batches match the selected status.'
						: 'Create your first batch to start organizing pilgrim groups.'}
				</p>
				<Button
					href="/admin/batches/new"
					variant="primary"
					text="Create First Batch"
					size="sm"
					class="mt-4" />
			</div>
		{:else}
			<!-- Table Header -->
			<div
				class="hidden border-b border-gray-100 bg-gray-50/50 px-6 py-4 text-xs font-bold tracking-wider text-gray-400 uppercase md:grid md:grid-cols-12">
				<div class="col-span-3">Batch Name</div>
				<div class="col-span-2">Dates</div>
				<div class="col-span-2">Guide</div>
				<div class="col-span-2">Pilgrims</div>
				<div class="col-span-2">Status</div>
				<div class="col-span-1 text-right">Actions</div>
			</div>

			<!-- Table Rows -->
			{#each batches as batch}
				<div class="border-b border-gray-50 last:border-0">
					<div
						class="flex flex-col gap-4 px-6 py-5 md:grid md:grid-cols-12 md:items-center md:gap-0">
						<!-- Batch Name -->
						<a href="/admin/batches/{batch.$id}" class="group col-span-3 flex items-center gap-4">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Icon icon="heroicons:calendar-days" class="h-5 w-5" />
							</div>
							<div>
								<h3 class="font-medium text-secondary group-hover:text-primary">
									{batch.name}
								</h3>
								<p class="text-xs text-gray-400">ID: {batch.$id.slice(0, 8)}...</p>
							</div>
						</a>

						<!-- Dates -->
						<div class="col-span-2 flex flex-col gap-1">
							<p class="text-sm text-gray-600">{formatDate(batch.startDate)}</p>
							<p class="text-xs text-gray-400">to {formatDate(batch.endDate)}</p>
						</div>

						<!-- Guide -->
						<div class="col-span-2 flex flex-col gap-1">
							{#if batch.guideName}
								<p class="text-sm font-medium text-secondary">{batch.guideName}</p>
								<p class="text-xs text-gray-400">{batch.guidePhone || 'No phone'}</p>
							{:else}
								<p class="text-sm text-gray-400">Not assigned</p>
							{/if}
						</div>

						<!-- Pilgrims -->
						<div class="col-span-2">
							<div class="flex items-center gap-2">
								<Icon icon="heroicons:users" class="h-4 w-4 text-gray-400" />
								<span class="text-sm font-medium text-secondary">
									{batch.pilgrimCount || 0}
									{#if batch.maxCapacity}
										<span class="text-gray-400">/ {batch.maxCapacity}</span>
									{/if}
								</span>
							</div>
						</div>

						<!-- Status -->
						<div class="col-span-2">
							<span
								class="inline-flex rounded-full px-3 py-1 text-xs font-bold {getStatusStyle(
									batch.status
								)}">
								{formatStatus(batch.status)}
							</span>
						</div>

						<!-- Actions -->
						<div class="col-span-1 flex justify-end gap-2">
							<a
								href="/admin/batches/{batch.$id}"
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
		<div class="flex items-center justify-between">
			<p class="text-sm text-gray-500">
				Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)} of {total}
				batches
			</p>
			<div class="flex items-center gap-2">
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
