<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Modal from '$components/ui/Modal.svelte';
	import Button from '$components/ui/Button.svelte';

	let isLoading = $state(true);
	let isSaving = $state(false);
	let batch = $state(null);
	let pilgrims = $state([]);
	let guides = $state([]);
	let error = $state(null);
	let isEditing = $state(false);

	// Editable fields
	let editData = $state({});

	const batchId = $derived($page.params.id);

	const statusOptions = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'open', label: 'Open' },
		{ value: 'closed', label: 'Closed' },
		{ value: 'in_progress', label: 'In Progress' },
		{ value: 'completed', label: 'Completed' }
	];

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
	 * Format date for display
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
	 * Format date for input
	 */
	function formatDateForInput(dateString) {
		if (!dateString) return '';
		return new Date(dateString).toISOString().split('T')[0];
	}

	/**
	 * Fetch batch data
	 */
	async function fetchBatch() {
		try {
			const response = await fetch(`/api/admin/batches/${batchId}`);
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to fetch batch');
			}

			batch = result.batch;

			// Initialize edit data
			editData = {
				name: batch.name,
				startDate: formatDateForInput(batch.startDate),
				endDate: formatDateForInput(batch.endDate),
				guideId: batch.guideId || '',
				guideName: batch.guideName || '',
				guidePhone: batch.guidePhone || '',
				meetingPoint: batch.meetingPoint || '',
				meetingPointAddress: batch.meetingPointAddress || '',
				maxCapacity: batch.maxCapacity || 50,
				status: batch.status,
				notes: batch.notes || ''
			};

			// Fetch pilgrims
			await fetchPilgrims();
		} catch (err) {
			console.error('Failed to fetch batch:', err);
			error = err.message;
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Fetch pilgrims for this batch
	 */
	async function fetchPilgrims() {
		try {
			const response = await fetch(`/api/admin/batches/${batchId}/pilgrims`);
			const result = await response.json();

			if (result.success) {
				pilgrims = result.pilgrims;
			}
		} catch (err) {
			console.error('Failed to fetch pilgrims:', err);
		}
	}

	/**
	 * Fetch available guides
	 */
	async function fetchGuides() {
		try {
			const response = await fetch('/api/admin/guides');
			const result = await response.json();

			if (result.success) {
				guides = result.guides;
			}
		} catch (err) {
			console.error('Failed to fetch guides:', err);
		}
	}

	/**
	 * Handle guide selection
	 */
	function handleGuideChange(e) {
		const selectedGuideId = e.target.value;
		if (selectedGuideId) {
			const selectedGuide = guides.find((g) => g.$id === selectedGuideId);
			if (selectedGuide) {
				editData.guideId = selectedGuide.$id;
				editData.guideName = selectedGuide.name;
				editData.guidePhone = selectedGuide.phone || '';
			}
		} else {
			editData.guideId = '';
			editData.guideName = '';
			editData.guidePhone = '';
		}
	}

	/**
	 * Save batch changes
	 */
	async function saveBatch() {
		isSaving = true;
		try {
			const response = await fetch(`/api/admin/batches/${batchId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...editData,
					startDate: new Date(editData.startDate).toISOString(),
					endDate: new Date(editData.endDate).toISOString()
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to save changes');
			}

			batch = result.batch;
			isEditing = false;
		} catch (err) {
			console.error('Failed to save batch:', err);
			alert('Failed to save changes: ' + err.message);
		} finally {
			isSaving = false;
		}
	}

	/**
	 * Delete batch
	 */
	async function deleteBatch() {
		if (
			!confirm(
				'Are you sure you want to delete this batch? This action cannot be undone. Batches with assigned pilgrims cannot be deleted.'
			)
		) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/batches/${batchId}`, {
				method: 'DELETE'
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to delete batch');
			}

			goto('/admin/batches');
		} catch (err) {
			console.error('Failed to delete batch:', err);
			alert('Failed to delete batch: ' + err.message);
		}
	}

	/**
	 * Get initials from name
	 */
	function getInitials(firstName, lastName) {
		return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
	}

	onMount(() => {
		fetchBatch();
		fetchGuides();
	});
</script>

{#if isLoading}
	<Modal text="Loading batch details..." />
{/if}

{#if isSaving}
	<Modal text="Saving changes..." />
{/if}

<div class="mx-auto w-full max-w-6xl space-y-8 p-6 md:p-10" in:fade={{ duration: 500 }}>
	<!-- Back Button & Header -->
	<div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
		<div>
			<a
				href="/admin/batches"
				class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary">
				<Icon icon="heroicons:arrow-left" class="h-4 w-4" />
				Back to Batches
			</a>

			{#if batch}
				<h1 class="text-3xl font-medium tracking-tighter text-secondary md:text-4xl">
					{batch.name}
				</h1>
				<div class="mt-2 flex items-center gap-3">
					<span class="rounded-full px-3 py-1 text-xs font-bold {getStatusStyle(batch.status)}">
						{formatStatus(batch.status)}
					</span>
					<span class="text-sm text-gray-400">
						{batch.pilgrimCount || 0} pilgrims
					</span>
				</div>
			{/if}
		</div>

		<div class="flex items-center gap-3">
			{#if isEditing}
				<Button onclick={() => (isEditing = false)} variant="secondary" text="Cancel" size="sm" />
				<Button onclick={saveBatch} variant="primary" text="Save Changes" size="sm" />
			{:else}
				<Button onclick={() => (isEditing = true)} variant="secondary" text="Edit" size="sm" />
				<button
					onclick={deleteBatch}
					class="flex h-10 items-center gap-2 rounded-full border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
					<Icon icon="heroicons:trash" class="h-4 w-4" />
					Delete
				</button>
			{/if}
		</div>
	</div>

	{#if error}
		<div class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
			<Icon icon="heroicons:exclamation-triangle" class="mx-auto mb-2 h-8 w-8 text-red-500" />
			<p class="font-medium text-red-600">{error}</p>
		</div>
	{:else if batch}
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- Batch Details -->
			<div class="rounded-4xl border border-gray-100 bg-white p-6 lg:col-span-2">
				<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
					<Icon icon="heroicons:information-circle" class="h-5 w-5 text-gray-400" />
					Batch Details
				</h2>

				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Batch Name</label>
						{#if isEditing}
							<input
								type="text"
								bind:value={editData.name}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-secondary">{batch.name || '-'}</p>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Status</label>
						{#if isEditing}
							<select
								bind:value={editData.status}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary">
								{#each statusOptions as opt}
									<option value={opt.value}>{opt.label}</option>
								{/each}
							</select>
						{:else}
							<span
								class="inline-flex rounded-full px-3 py-1 text-xs font-bold {getStatusStyle(
									batch.status
								)}">
								{formatStatus(batch.status)}
							</span>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Start Date</label>
						{#if isEditing}
							<input
								type="date"
								bind:value={editData.startDate}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-secondary">{formatDate(batch.startDate)}</p>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>End Date</label>
						{#if isEditing}
							<input
								type="date"
								bind:value={editData.endDate}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-secondary">{formatDate(batch.endDate)}</p>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Max Capacity</label>
						{#if isEditing}
							<input
								type="number"
								bind:value={editData.maxCapacity}
								min="1"
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-secondary">{batch.maxCapacity || 50}</p>
						{/if}
					</div>

					<div class="sm:col-span-2">
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Notes</label>
						{#if isEditing}
							<textarea
								bind:value={editData.notes}
								rows="3"
								class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-secondary outline-none focus:border-primary"
							></textarea>
						{:else}
							<p class="text-secondary">{batch.notes || '-'}</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Guide Assignment -->
			<div class="rounded-4xl border border-gray-100 bg-white p-6">
				<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
					<Icon icon="heroicons:user-circle" class="h-5 w-5 text-gray-400" />
					Guide
				</h2>

				{#if isEditing}
					<div class="space-y-4">
						<div>
							<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
								>Select Guide</label>
							<select
								value={editData.guideId}
								onchange={handleGuideChange}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary">
								<option value="">No guide assigned</option>
								{#each guides as guide}
									<option value={guide.$id}>{guide.name}</option>
								{/each}
							</select>
						</div>

						<div>
							<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
								>Guide Phone</label>
							<input
								type="tel"
								bind:value={editData.guidePhone}
								placeholder="Phone number"
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						</div>
					</div>
				{:else if batch.guideName}
					<div class="flex items-center gap-4">
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
							{batch.guideName?.[0] || 'G'}
						</div>
						<div>
							<p class="font-medium text-secondary">{batch.guideName}</p>
							<p class="text-sm text-gray-400">{batch.guidePhone || 'No phone'}</p>
						</div>
					</div>
				{:else}
					<p class="text-gray-400">No guide assigned</p>
				{/if}
			</div>

			<!-- Meeting Point -->
			<div class="rounded-4xl border border-gray-100 bg-white p-6 lg:col-span-2">
				<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
					<Icon icon="heroicons:map-pin" class="h-5 w-5 text-gray-400" />
					Meeting Point
				</h2>

				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Location Name</label>
						{#if isEditing}
							<input
								type="text"
								bind:value={editData.meetingPoint}
								placeholder="e.g., Main Lobby"
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-secondary">{batch.meetingPoint || '-'}</p>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Full Address</label>
						{#if isEditing}
							<input
								type="text"
								bind:value={editData.meetingPointAddress}
								placeholder="Full address"
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-secondary">{batch.meetingPointAddress || '-'}</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Pilgrims List -->
			<div class="rounded-4xl border border-gray-100 bg-white p-6 lg:col-span-3">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="flex items-center gap-2 text-lg font-bold text-secondary">
						<Icon icon="heroicons:users" class="h-5 w-5 text-gray-400" />
						Assigned Pilgrims ({pilgrims.length})
					</h2>
				</div>

				{#if pilgrims.length === 0}
					<div class="py-8 text-center">
						<Icon icon="heroicons:users" class="mx-auto mb-2 h-8 w-8 text-gray-200" />
						<p class="text-sm text-gray-400">No pilgrims assigned to this batch yet</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each pilgrims as pilgrimData}
							{@const pilgrim = pilgrimData.leadPilgrim}
							{#if pilgrim}
								<a
									href="/admin/pilgrims/{pilgrim.$id}"
									class="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-100">
									<div class="flex items-center gap-4">
										<div
											class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
											{getInitials(pilgrim.firstName, pilgrim.lastName)}
										</div>
										<div>
											<p class="font-medium text-secondary group-hover:text-primary">
												{pilgrim.firstName}
												{pilgrim.lastName}
											</p>
											<p class="text-xs text-gray-400">
												{pilgrimData.pilgrimCount} pilgrim{pilgrimData.pilgrimCount > 1 ? 's' : ''}
												in group
											</p>
										</div>
									</div>
									<Icon
										icon="heroicons:chevron-right"
										class="h-4 w-4 text-gray-400 group-hover:text-primary" />
								</a>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
