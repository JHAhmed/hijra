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

	// Track expanded lead pilgrims and their family members
	let expandedPilgrims = $state({});
	let familyMembers = $state({});
	let loadingFamily = $state({});

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
			// Only fetch lead pilgrims
			let url = `/api/admin/pilgrims?limit=${limit}&offset=${offset}&isLead=true`;
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
	 * Fetch family members for a lead pilgrim
	 */
	async function fetchFamilyMembers(leadPilgrim) {
		const pilgrimId = leadPilgrim.$id;
		
		// Toggle off if already expanded
		if (expandedPilgrims[pilgrimId]) {
			expandedPilgrims = { ...expandedPilgrims, [pilgrimId]: false };
			return;
		}

		// If we already have the family members, just expand
		if (familyMembers[pilgrimId]) {
			expandedPilgrims = { ...expandedPilgrims, [pilgrimId]: true };
			return;
		}

		// Fetch family members using the same applicationId
		if (!leadPilgrim.applicationId) {
			expandedPilgrims = { ...expandedPilgrims, [pilgrimId]: true };
			familyMembers = { ...familyMembers, [pilgrimId]: [] };
			return;
		}

		loadingFamily = { ...loadingFamily, [pilgrimId]: true };

		try {
			const response = await fetch(`/api/admin/pilgrims?applicationId=${leadPilgrim.applicationId}&isLead=false&limit=50`);
			const result = await response.json();

			if (result.success) {
				familyMembers = { ...familyMembers, [pilgrimId]: result.pilgrims };
			}
		} catch (error) {
			console.error('Failed to fetch family members:', error);
			familyMembers = { ...familyMembers, [pilgrimId]: [] };
		} finally {
			loadingFamily = { ...loadingFamily, [pilgrimId]: false };
			expandedPilgrims = { ...expandedPilgrims, [pilgrimId]: true };
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

		<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
			<!-- Search Input -->
			<div class="relative w-full sm:w-auto">
				<Icon
					icon="heroicons:magnifying-glass"
					class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					placeholder="Search by name..."
					bind:value={searchQuery}
					onkeydown={(e) => e.key === 'Enter' && handleSearch()}
					class="h-10 w-full sm:w-64 rounded-full border border-gray-200 bg-white pr-4 pl-10 text-sm text-secondary transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
			</div>
			<Button onclick={handleSearch} variant="secondary" text="Search" size="sm" />
		</div>
	</div>

	<!-- Stats Summary -->
	<div class="flex items-center gap-4">
		<div class="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2">
			<Icon icon="heroicons:user-group" class="h-4 w-4 text-gray-500" />
			<span class="text-sm font-medium text-secondary">{total} Lead Pilgrims</span>
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
				<div class="border-b border-gray-50 last:border-0">
					<div class="flex flex-col gap-4 px-6 py-5 md:grid md:grid-cols-12 md:items-center md:gap-0">
						<!-- Pilgrim Info -->
						<a href="/admin/pilgrims/{pilgrim.$id}" class="col-span-4 flex items-center gap-4 group">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
								{getInitials(pilgrim.firstName, pilgrim.lastName)}
							</div>
							<div>
								<h3 class="font-medium text-secondary group-hover:text-primary">
									{pilgrim.firstName}
									{pilgrim.lastName}
								</h3>
								<p class="text-xs text-gray-400 capitalize">Lead Pilgrim</p>
							</div>
						</a>

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
							<button
								onclick={() => fetchFamilyMembers(pilgrim)}
								class="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:border-primary hover:text-primary">
								{#if loadingFamily[pilgrim.$id]}
									<Icon icon="heroicons:arrow-path" class="h-3.5 w-3.5 animate-spin" />
									Loading...
								{:else if expandedPilgrims[pilgrim.$id]}
									<Icon icon="heroicons:chevron-up" class="h-3.5 w-3.5" />
									Hide Family
								{:else}
									<Icon icon="heroicons:users" class="h-3.5 w-3.5" />
									View Family
								{/if}
							</button>
							<a
								href="/admin/pilgrims/{pilgrim.$id}"
								class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-primary hover:text-white">
								<Icon icon="heroicons:chevron-right" class="h-4 w-4" />
							</a>
						</div>
					</div>

					<!-- Family Members (Expandable) -->
					{#if expandedPilgrims[pilgrim.$id]}
						<div class="border-t border-gray-100 bg-gray-50/30 px-6 py-4">
							{#if familyMembers[pilgrim.$id]?.length > 0}
								<p class="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
									Family Members ({familyMembers[pilgrim.$id].length})
								</p>
								<div class="space-y-2">
									{#each familyMembers[pilgrim.$id] as member}
										<a
											href="/admin/pilgrims/{member.$id}"
											class="group flex items-center gap-4 rounded-xl bg-white px-4 py-3 transition-colors hover:bg-gray-50">
											<div
												class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
												{getInitials(member.firstName, member.lastName)}
											</div>
											<div class="flex-1">
												<h4 class="text-sm font-medium text-secondary group-hover:text-primary">
													{member.firstName} {member.lastName}
												</h4>
												<p class="text-xs text-gray-400 capitalize">{member.relation || 'Family Member'}</p>
											</div>
											<Icon icon="heroicons:chevron-right" class="h-4 w-4 text-gray-400 group-hover:text-primary" />
										</a>
									{/each}
								</div>
							{:else}
								<p class="text-sm text-gray-400">No family members registered</p>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<p class="text-sm text-gray-500 text-center sm:text-left">
				Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)} of {total}
				pilgrims
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
