<script>
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Modal from '$components/ui/Modal.svelte';
	import Button from '$components/ui/Button.svelte';
	import { onMount } from 'svelte';

	let isLoading = $state(false);
	let guides = $state([]);
	let error = $state(null);

	// Auto-assignment feature
	let autoAssignMonth = $state('');
	let matchingApplications = $state([]);
	let loadingMatches = $state(false);

	// Form data
	let formData = $state({
		name: '',
		startDate: '',
		endDate: '',
		guideId: '',
		guideName: '',
		guidePhone: '',
		meetingPoint: '',
		meetingPointAddress: '',
		maxCapacity: 50,
		status: 'draft',
		notes: ''
	});

	const statusOptions = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'open', label: 'Open' },
		{ value: 'closed', label: 'Closed' }
	];

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
				formData.guideId = selectedGuide.$id;
				formData.guideName = selectedGuide.name;
				formData.guidePhone = selectedGuide.phone || '';
			}
		} else {
			formData.guideId = '';
			formData.guideName = '';
			formData.guidePhone = '';
		}
	}

	/**
	 * Fetch applications matching the preferred month
	 */
	async function fetchMatchingApplications() {
		if (!autoAssignMonth) {
			matchingApplications = [];
			return;
		}

		loadingMatches = true;
		try {
			const response = await fetch(`/api/admin/batches/temp/assign?month=${autoAssignMonth}`);
			const result = await response.json();
			if (result.success) {
				matchingApplications = result.applications;
			}
		} catch (err) {
			console.error('Failed to fetch matching applications:', err);
		} finally {
			loadingMatches = false;
		}
	}

	/**
	 * Create batch
	 */
	async function createBatch() {
		if (!formData.name || !formData.startDate || !formData.endDate) {
			error = 'Please fill in required fields: Name, Start Date, End Date';
			return;
		}

		isLoading = true;
		error = null;

		try {
			// Create the batch
			const response = await fetch('/api/admin/batches', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					startDate: new Date(formData.startDate).toISOString(),
					endDate: new Date(formData.endDate).toISOString()
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to create batch');
			}

			const batchId = result.batch.$id;

			// Auto-assign matching pilgrims if any
			if (matchingApplications.length > 0) {
				const appIds = matchingApplications.map(app => app.$id);
				await fetch(`/api/admin/batches/${batchId}/assign`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ applicationIds: appIds })
				});
			}

			goto(`/admin/batches/${batchId}`);
		} catch (err) {
			console.error('Failed to create batch:', err);
			error = err.message;
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		fetchGuides();
	});
</script>

{#if isLoading}
	<Modal text="Creating batch..." />
{/if}

<div class="mx-auto w-full max-w-4xl space-y-8 p-6 md:p-10" in:fade={{ duration: 500 }}>
	<!-- Header -->
	<div>
		<a
			href="/admin/batches"
			class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary">
			<Icon icon="heroicons:arrow-left" class="h-4 w-4" />
			Back to Batches
		</a>

		<h1 class="text-3xl font-medium tracking-tighter text-secondary md:text-4xl">
			Create New Batch
		</h1>
		<p class="mt-2 text-gray-500">
			Create a new batch to organize pilgrims for their journey.
		</p>
	</div>

	{#if error}
		<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
			{error}
		</div>
	{/if}

	<form onsubmit={(e) => { e.preventDefault(); createBatch(); }} class="space-y-6">
		<!-- Basic Info -->
		<div class="rounded-4xl border border-gray-100 bg-white p-6">
			<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
				<Icon icon="heroicons:information-circle" class="h-5 w-5 text-gray-400" />
				Basic Information
			</h2>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div class="sm:col-span-2">
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Batch Name <span class="text-red-500">*</span></label>
					<input
						type="text"
						bind:value={formData.name}
						placeholder="e.g., January 2026 Batch"
						required
						class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
				</div>

				<div>
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Start Date <span class="text-red-500">*</span></label>
					<input
						type="date"
						bind:value={formData.startDate}
						required
						class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
				</div>

				<div>
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>End Date <span class="text-red-500">*</span></label>
					<input
						type="date"
						bind:value={formData.endDate}
						required
						class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
				</div>

				<div>
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Status</label>
					<select
						bind:value={formData.status}
						class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary">
						{#each statusOptions as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Max Capacity</label>
					<input
						type="number"
						bind:value={formData.maxCapacity}
						min="1"
						class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
				</div>

				<div class="sm:col-span-2">
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Notes</label>
					<textarea
						bind:value={formData.notes}
						rows="3"
						placeholder="Optional notes about this batch..."
						class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-secondary outline-none focus:border-primary"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Auto-Assign Pilgrims -->
		<div class="rounded-4xl border border-gray-100 bg-white p-6">
			<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
				<Icon icon="heroicons:user-plus" class="h-5 w-5 text-gray-400" />
				Auto-Assign Pilgrims (Optional)
			</h2>
			<p class="mb-4 text-sm text-gray-500">
				Select a month to automatically include all pilgrims who chose that as their preferred travel month.
			</p>

			<div class="flex items-end gap-4">
				<div class="flex-1">
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Preferred Month Filter</label>
					<input
						type="month"
						bind:value={autoAssignMonth}
						class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
				</div>
				<Button 
					onclick={fetchMatchingApplications} 
					variant="secondary" 
					text={loadingMatches ? 'Loading...' : 'Find Pilgrims'} 
					size="sm"
					disabled={!autoAssignMonth || loadingMatches} />
			</div>

			{#if matchingApplications.length > 0}
				<div class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
					<div class="flex items-center gap-2 text-emerald-800">
						<Icon icon="heroicons:check-circle" class="h-5 w-5" />
						<span class="font-medium">{matchingApplications.length} pilgrim(s) will be auto-assigned to this batch</span>
					</div>
					<div class="mt-3 max-h-32 overflow-y-auto space-y-1">
						{#each matchingApplications as app}
							<p class="text-sm text-emerald-700">
								• {app.leadPilgrim?.firstName || 'Unknown'} {app.leadPilgrim?.lastName || ''}
							</p>
						{/each}
					</div>
				</div>
			{:else if autoAssignMonth && !loadingMatches}
				<p class="mt-4 text-sm text-gray-400">No unassigned pilgrims found for this month.</p>
			{/if}
		</div>

		<!-- Guide Assignment -->
		<div class="rounded-4xl border border-gray-100 bg-white p-6">
			<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
				<Icon icon="heroicons:user-circle" class="h-5 w-5 text-gray-400" />
				Guide (Optional)
			</h2>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div>
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Select Guide</label>
					<select
						value={formData.guideId}
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
						bind:value={formData.guidePhone}
						placeholder="Phone number"
						class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
				</div>
			</div>
		</div>

		<!-- Meeting Point -->
		<div class="rounded-4xl border border-gray-100 bg-white p-6">
			<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
				<Icon icon="heroicons:map-pin" class="h-5 w-5 text-gray-400" />
				Meeting Point (Optional)
			</h2>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div>
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Location Name</label>
					<input
						type="text"
						bind:value={formData.meetingPoint}
						placeholder="e.g., Main Lobby"
						class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
				</div>

				<div>
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Full Address</label>
					<input
						type="text"
						bind:value={formData.meetingPointAddress}
						placeholder="Full address"
						class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex justify-end gap-4">
			<Button href="/admin/batches" variant="secondary" text="Cancel" size="md" />
			<Button type="submit" variant="primary" text="Create Batch" size="md" />
		</div>
	</form>
</div>
