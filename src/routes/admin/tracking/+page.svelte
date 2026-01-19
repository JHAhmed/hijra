<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Modal from '$components/ui/Modal.svelte';

	let isLoading = $state(true);
	let batches = $state([]);
	let total = $state(0);
	let currentPage = $state(1);
	let trackingFilter = $state('');
	const limit = 20;

	/**
	 * Get tracking status badge styling
	 */
	function getTrackingStatusStyle(hasTracking, isActive) {
		if (!hasTracking) return 'bg-gray-100 text-gray-500';
		if (isActive) return 'bg-emerald-50 text-emerald-600';
		return 'bg-amber-50 text-amber-600';
	}

	/**
	 * Get tracking status text
	 */
	function getTrackingStatusText(hasTracking, isActive) {
		if (!hasTracking) return 'No Tracking';
		if (isActive) return 'Live';
		return 'Paused';
	}

	/**
	 * Get batch status badge styling
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
	 * Format relative time for last update
	 */
	function formatRelativeTime(dateString) {
		if (!dateString) return 'Never';
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return formatDate(dateString);
	}

	/**
	 * Get activity info
	 */
	function getActivityInfo(activity) {
		const activities = {
			tawaf: { label: 'Tawaf', icon: 'mdi:rotate-360' },
			sai: { label: "Sa'i", icon: 'mdi:walk' },
			mina: { label: 'At Mina', icon: 'mdi:tent' },
			arafat: { label: 'At Arafat', icon: 'mdi:weather-sunny' },
			muzdalifah: { label: 'At Muzdalifah', icon: 'mdi:weather-night' },
			jamarat: { label: 'At Jamarat', icon: 'mdi:target' },
			resting: { label: 'Resting', icon: 'mdi:bed' },
			traveling: { label: 'Traveling', icon: 'mdi:bus' }
		};
		return activities[activity] || { label: activity || 'Unknown', icon: 'mdi:map-marker' };
	}

	/**
	 * Fetch batches with tracking info from API
	 */
	async function fetchBatches() {
		try {
			const offset = (currentPage - 1) * limit;
			let url = `/api/admin/batches?limit=${limit}&offset=${offset}&includeTracking=true`;
			
			// Filter by tracking status
			if (trackingFilter === 'active') {
				url += '&trackingActive=true';
			} else if (trackingFilter === 'paused') {
				url += '&trackingPaused=true';
			} else if (trackingFilter === 'none') {
				url += '&noTracking=true';
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
	 * Handle filter change
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
	<Modal text="Loading tracking data..." />
{/if}

<div class="mx-auto w-full max-w-10xl space-y-8 p-6 md:p-10" in:fade={{ duration: 500 }}>
	<!-- Header -->
	<div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
		<div class="space-y-1">
			<span class="text-xs font-bold tracking-widest text-gray-400 uppercase">Management</span>
			<h1 class="text-3xl font-medium tracking-tighter text-secondary md:text-4xl">Tracking</h1>
			<p class="text-gray-500">Monitor live location sharing for all batches</p>
		</div>

		<div class="flex items-center gap-3">
			<!-- Tracking Status Filter -->
			<select
				bind:value={trackingFilter}
				onchange={handleFilterChange}
				class="h-10 rounded-full border border-gray-200 bg-white px-4 text-sm text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
				<option value="">All Batches</option>
				<option value="active">Live Tracking</option>
				<option value="paused">Tracking Paused</option>
				<option value="none">No Tracking</option>
			</select>
		</div>
	</div>

	<!-- Stats Summary -->
	<div class="flex flex-wrap items-center gap-4">
		<div class="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2">
			<Icon icon="mdi:map-marker-radius" class="h-4 w-4 text-gray-500" />
			<span class="text-sm font-medium text-secondary">{total} Batches</span>
		</div>
		<div class="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
			<span class="relative flex h-2 w-2">
				<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
				<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
			</span>
			<span class="text-sm font-medium text-emerald-700">
				{batches.filter(b => b.trackingActive).length} Live
			</span>
		</div>
	</div>

	<!-- Batches Table -->
	<div class="overflow-hidden rounded-4xl border border-gray-100 bg-white">
		{#if batches.length === 0 && !isLoading}
			<!-- Empty State -->
			<div class="flex flex-col items-center justify-center py-20 text-center">
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
					<Icon icon="mdi:map-marker-off" class="h-8 w-8 text-gray-300" />
				</div>
				<h3 class="mb-2 text-xl font-bold text-secondary">No Batches Found</h3>
				<p class="max-w-md text-gray-500">
					{trackingFilter
						? 'No batches match the selected tracking status.'
						: 'Create batches and enable tracking to monitor pilgrim journeys.'}
				</p>
			</div>
		{:else}
			<!-- Table Header -->
			<div
				class="hidden border-b border-gray-100 bg-gray-50/50 px-6 py-4 text-xs font-bold tracking-wider text-gray-400 uppercase md:grid md:grid-cols-12">
				<div class="col-span-3">Batch</div>
				<div class="col-span-2">Tracking Status</div>
				<div class="col-span-2">Current Activity</div>
				<div class="col-span-2">Last Update</div>
				<div class="col-span-2">Pilgrims</div>
				<div class="col-span-1 text-right">Actions</div>
			</div>

			<!-- Table Rows -->
			{#each batches as batch}
				<div class="border-b border-gray-50 last:border-0">
					<div
						class="flex flex-col gap-4 px-6 py-5 md:grid md:grid-cols-12 md:items-center md:gap-0">
						<!-- Batch Info -->
						<a href="/admin/batches/{batch.$id}/track" class="group col-span-3 flex items-center gap-4">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full {batch.trackingActive ? 'bg-emerald-100' : 'bg-gray-100'}">
								<Icon 
									icon={batch.trackingActive ? 'mdi:broadcast' : 'mdi:map-marker'} 
									class="h-5 w-5 {batch.trackingActive ? 'text-emerald-600' : 'text-gray-500'}" 
								/>
							</div>
							<div>
								<h3 class="font-medium text-secondary group-hover:text-primary">
									{batch.name}
								</h3>
								<p class="text-xs text-gray-400">
									{formatDate(batch.startDate)} - {formatDate(batch.endDate)}
								</p>
							</div>
						</a>

						<!-- Tracking Status -->
						<div class="col-span-2">
							<div class="flex items-center gap-2">
								{#if batch.trackingActive}
									<span class="relative flex h-2.5 w-2.5">
										<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
										<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
									</span>
								{/if}
								<span
									class="inline-flex rounded-full px-3 py-1 text-xs font-bold {getTrackingStatusStyle(batch.trackingCode, batch.trackingActive)}">
									{getTrackingStatusText(batch.trackingCode, batch.trackingActive)}
								</span>
							</div>
							{#if batch.trackingCode}
								<p class="mt-1 font-mono text-xs text-gray-400">{batch.trackingCode}</p>
							{/if}
						</div>

						<!-- Current Activity -->
						<div class="col-span-2">
							{#if batch.currentActivity}
								{@const activityInfo = getActivityInfo(batch.currentActivity)}
								<div class="flex items-center gap-2">
									<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
										<Icon icon={activityInfo.icon} class="h-4 w-4 text-blue-600" />
									</div>
									<span class="text-sm font-medium text-secondary">{activityInfo.label}</span>
								</div>
							{:else}
								<span class="text-sm text-gray-400">-</span>
							{/if}
						</div>

						<!-- Last Update -->
						<div class="col-span-2">
							{#if batch.lastLocationUpdate}
								<div class="flex items-center gap-2">
									<Icon icon="mdi:clock-outline" class="h-4 w-4 text-gray-400" />
									<span class="text-sm text-gray-600">{formatRelativeTime(batch.lastLocationUpdate)}</span>
								</div>
							{:else}
								<span class="text-sm text-gray-400">Never</span>
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

						<!-- Actions -->
						<div class="col-span-1 flex justify-end gap-2">
							<!-- <a
								href="/admin/batches/{batch.$id}/track"
								class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-primary hover:text-white"
								title="Manage Tracking">
								<Icon icon="mdi:map-marker-radius" class="h-4 w-4" />
							</a> -->
							<a
								href="/admin/batches/{batch.$id}/track"
								class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
								title="View Batch">
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
