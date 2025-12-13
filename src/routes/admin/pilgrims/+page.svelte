<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Modal from '$components/ui/Modal.svelte';
	import Button from '$components/ui/Button.svelte';

	let isLoading = $state(true);
	let pilgrims = $state([]);
	let total = $state(0);
	let searchQuery = $state('');
	let currentPage = $state(1);
	const limit = 20;

	/**
	 * Get status badge styling
	 */
	function getStatusStyle(status) {
		const styles = {
			package_selected: 'bg-blue-50 text-blue-600',
			details_submitted: 'bg-purple-50 text-purple-600',
			docs_review: 'bg-amber-50 text-amber-600',
			pending_payment: 'bg-orange-50 text-orange-600',
			payment_completed: 'bg-emerald-50 text-emerald-600',
			visa_processing: 'bg-cyan-50 text-cyan-600',
			visa_approved: 'bg-green-50 text-green-600',
			completed: 'bg-gray-100 text-gray-600'
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
	 * Get initials from name
	 */
	function getInitials(firstName, lastName) {
		return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
	}

	/**
	 * Fetch pilgrims from API
	 */
	async function fetchPilgrims() {
		try {
			const offset = (currentPage - 1) * limit;
			let url = `/api/admin/pilgrims?limit=${limit}&offset=${offset}`;
			if (searchQuery) {
				url += `&search=${encodeURIComponent(searchQuery)}`;
			}

			const response = await fetch(url);
			const result = await response.json();

			if (result.success) {
				pilgrims = result.pilgrims;
				total = result.total;
			}
		} catch (error) {
			console.error('Failed to fetch pilgrims:', error);
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Handle search input
	 */
	function handleSearch() {
		currentPage = 1;
		isLoading = true;
		fetchPilgrims();
	}

	/**
	 * Handle pagination
	 */
	function goToPage(page) {
		currentPage = page;
		isLoading = true;
		fetchPilgrims();
	}

	// Calculate total pages
	const totalPages = $derived(Math.ceil(total / limit));

	onMount(() => {
		fetchPilgrims();
	});
</script>

{#if isLoading}
	<Modal text="Loading pilgrims..." />
{/if}

<div class="mx-auto w-full max-w-10xl space-y-8 p-6 md:p-10" in:fade={{ duration: 500 }}>
	<!-- Header -->
	<div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
		<div class="space-y-1">
			<span class="text-xs font-bold tracking-widest text-gray-400 uppercase">Management</span>
			<h1 class="text-3xl font-medium tracking-tighter text-secondary md:text-4xl">Pilgrims</h1>
		</div>

		<div class="flex items-center gap-3">
			<!-- Search Input -->
			<div class="relative">
				<Icon
					icon="heroicons:magnifying-glass"
					class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					placeholder="Search by name..."
					bind:value={searchQuery}
					onkeydown={(e) => e.key === 'Enter' && handleSearch()}
					class="h-10 w-64 rounded-full border border-gray-200 bg-white pr-4 pl-10 text-sm text-secondary transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
			</div>
			<Button onclick={handleSearch} variant="secondary" text="Search" size="sm" />
		</div>
	</div>

	<!-- Stats Summary -->
	<div class="flex items-center gap-4">
		<div class="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2">
			<Icon icon="heroicons:user-group" class="h-4 w-4 text-gray-500" />
			<span class="text-sm font-medium text-secondary">{total} Total Pilgrims</span>
		</div>
	</div>

	<!-- Pilgrims Table -->
	<div class="overflow-hidden rounded-4xl border border-gray-100 bg-white">
		{#if pilgrims.length === 0 && !isLoading}
			<!-- Empty State -->
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
					<Icon icon="heroicons:user-group" class="h-8 w-8 text-gray-300" />
				</div>
				<h3 class="mb-2 text-xl font-bold text-secondary">No Pilgrims Found</h3>
				<p class="max-w-md text-gray-500">
					{searchQuery
						? 'No pilgrims match your search criteria.'
						: 'Pilgrims will appear here once they submit their applications.'}
				</p>
			</div>
		{:else}
			<!-- Table Header -->
			<div
				class="hidden border-b border-gray-100 bg-gray-50/50 px-6 py-4 text-xs font-bold tracking-wider text-gray-400 uppercase md:grid md:grid-cols-12">
				<div class="col-span-4">Pilgrim</div>
				<div class="col-span-2">Contact</div>
				<div class="col-span-2">Application</div>
				<div class="col-span-2">Status</div>
				<div class="col-span-2 text-right">Actions</div>
			</div>

			<!-- Table Rows -->
			{#each pilgrims as pilgrim}
				<a
					href="/admin/pilgrims/{pilgrim.$id}"
					class="group flex flex-col gap-4 border-b border-gray-50 px-6 py-5 transition-colors last:border-0 hover:bg-gray-50/50 md:grid md:grid-cols-12 md:items-center md:gap-0">
					<!-- Pilgrim Info -->
					<div class="col-span-4 flex items-center gap-4">
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
							{getInitials(pilgrim.firstName, pilgrim.lastName)}
						</div>
						<div>
							<h3 class="font-medium text-secondary group-hover:text-primary">
								{pilgrim.firstName}
								{pilgrim.lastName}
							</h3>
							<p class="text-xs text-gray-400 capitalize">
								{pilgrim.isLead ? 'Lead Pilgrim' : pilgrim.relation || 'Family Member'}
							</p>
						</div>
					</div>

					<!-- Contact -->
					<div class="col-span-2 flex flex-col gap-1">
						<p class="text-sm text-gray-600">{pilgrim.email || '-'}</p>
						<p class="text-xs text-gray-400">{pilgrim.phone || '-'}</p>
					</div>

					<!-- Application -->
					<div class="col-span-2 flex flex-col gap-1">
						{#if pilgrim.application}
							<p class="text-sm font-medium text-secondary">
								{pilgrim.application.$id.slice(0, 8)}...
							</p>
						{:else}
							<p class="text-sm text-gray-400">No application</p>
						{/if}
					</div>

					<!-- Status -->
					<div class="col-span-2">
						{#if pilgrim.application?.status}
							<span
								class="inline-flex rounded-full px-3 py-1 text-xs font-bold {getStatusStyle(
									pilgrim.application.status
								)}">
								{formatStatus(pilgrim.application.status)}
							</span>
						{:else}
							<span
								class="inline-flex rounded-full bg-gray-50 px-3 py-1 text-xs font-bold text-gray-400">
								Unknown
							</span>
						{/if}
					</div>

					<!-- Actions -->
					<div class="col-span-2 flex justify-end gap-2">
						<span
							class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors group-hover:bg-primary group-hover:text-white">
							<Icon icon="heroicons:chevron-right" class="h-4 w-4" />
						</span>
					</div>
				</a>
			{/each}
		{/if}
	</div>

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="flex items-center justify-between">
			<p class="text-sm text-gray-500">
				Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)} of {total}
				pilgrims
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
