<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Modal from '$components/ui/Modal.svelte';
	import Button from '$components/ui/Button.svelte';

	let isLoading = $state(true);
	let pilgrim = $state(null);
	let application = $state(null);
	let documents = $state([]);
	let packageDetails = $state(null);
	let error = $state(null);
	let isEditing = $state(false);
	let isSaving = $state(false);
	let approvingDocId = $state(null);

	// Editable fields
	let editData = $state({});

	const pilgrimId = $derived($page.params.id);

	async function viewFile(fileId, errorMessage = 'No file available') {
		if (!fileId) {
			toast.error(errorMessage);
			return;
		}

		isLoading = true;
		try {
			const res = await fetch('/api/admin/get-file-url', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fileId })
			});
			if (res.ok) {
				const { url } = await res.json();
				window.open(url, '_blank');
			} else {
				toast.error('Failed to get file URL');
			}
		} catch (e) {
			toast.error('Network error');
			console.error(e);
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Get status badge styling
	 */
	function getStatusStyle(status) {
		const styles = {
			package_selected: 'bg-blue-50 text-blue-600',
			details_submitted: 'bg-purple-50 text-purple-600',
			docs_review: 'bg-amber-50 text-amber-600',
			docs_approved: 'bg-teal-50 text-teal-600',
			payment_submitted: 'bg-indigo-50 text-indigo-600',
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
	 * Fetch pilgrim data
	 */
	async function fetchPilgrim() {
		try {
			const response = await fetch(`/api/admin/pilgrims/${pilgrimId}`);
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to fetch pilgrim');
			}

			pilgrim = result.pilgrim;
			application = result.application;
			documents = result.documents || [];
			packageDetails = result.package;

			// Initialize edit data
			editData = {
				firstName: pilgrim.firstName,
				lastName: pilgrim.lastName,
				email: pilgrim.email,
				phone: pilgrim.phone,
				gender: pilgrim.gender,
				passportNumber: pilgrim.passportNumber,
				passportExpiry: pilgrim.passportExpiry
			};
		} catch (err) {
			console.error('Failed to fetch pilgrim:', err);
			error = err.message;
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Save pilgrim changes
	 */
	async function savePilgrim() {
		isSaving = true;
		try {
			const response = await fetch(`/api/admin/pilgrims/${pilgrimId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editData)
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to save changes');
			}

			pilgrim = result.pilgrim;
			isEditing = false;
		} catch (err) {
			console.error('Failed to save pilgrim:', err);
			alert('Failed to save changes: ' + err.message);
		} finally {
			isSaving = false;
		}
	}

	/**
	 * Delete pilgrim
	 */
	async function deletePilgrim() {
		if (!confirm('Are you sure you want to delete this pilgrim? This action cannot be undone.')) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/pilgrims/${pilgrimId}`, {
				method: 'DELETE'
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to delete pilgrim');
			}

			goto('/admin/pilgrims');
		} catch (err) {
			console.error('Failed to delete pilgrim:', err);
			alert('Failed to delete pilgrim: ' + err.message);
		}
	}

	/**
	 * Approve or reject a document
	 */
	async function updateDocumentStatus(docId, status) {
		approvingDocId = docId;
		try {
			const response = await fetch(`/api/admin/documents/${docId}/approve`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					status,
					applicationId: application?.$id
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to update document');
			}

			// Update local document status
			documents = documents.map((doc) => (doc.$id === docId ? { ...doc, status } : doc));

			// Refresh application status
			await fetchPilgrim();
		} catch (err) {
			console.error('Failed to update document status:', err);
			alert('Failed to update document: ' + err.message);
		} finally {
			approvingDocId = null;
		}
	}

	onMount(() => {
		fetchPilgrim();
	});
</script>

{#if isLoading}
	<Modal text="Loading pilgrim details..." />
{/if}

{#if isSaving}
	<Modal text="Saving changes..." />
{/if}

<div class="mx-auto w-full max-w-6xl space-y-8 p-6 md:p-10" in:fade={{ duration: 500 }}>
	<!-- Back Button & Header -->
	<div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
		<div>
			<a
				href="/admin/pilgrims"
				class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary">
				<Icon icon="heroicons:arrow-left" class="h-4 w-4" />
				Back to Pilgrims
			</a>

			{#if pilgrim}
				<h1 class="text-3xl font-medium tracking-tighter text-secondary md:text-4xl">
					{pilgrim.firstName}
					{pilgrim.lastName}
				</h1>
				<div class="mt-2 flex items-center gap-3">
					{#if pilgrim.isLead}
						<span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
							Lead Pilgrim
						</span>
					{:else if pilgrim.relation}
						<span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
							{pilgrim.relation}
						</span>
					{/if}
					{#if application?.status}
						<span
							class="rounded-full px-3 py-1 text-xs font-bold {getStatusStyle(application.status)}">
							{formatStatus(application.status)}
						</span>
					{/if}
				</div>
			{/if}
		</div>

		<div class="flex items-center gap-3">
			{#if isEditing}
				<Button onclick={() => (isEditing = false)} variant="secondary" text="Cancel" size="sm" />
				<Button onclick={savePilgrim} variant="primary" text="Save Changes" size="sm" />
			{:else}
				<Button onclick={() => (isEditing = true)} variant="secondary" text="Edit" size="sm" />
				<button
					onclick={deletePilgrim}
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
	{:else if pilgrim}
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- Personal Information -->
			<div class="rounded-4xl border border-gray-100 bg-white p-6 lg:col-span-2">
				<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
					<Icon icon="heroicons:user" class="h-5 w-5 text-gray-400" />
					Personal Information
				</h2>

				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>First Name</label>
						{#if isEditing}
							<input
								type="text"
								bind:value={editData.firstName}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-secondary">{pilgrim.firstName || '-'}</p>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Last Name</label>
						{#if isEditing}
							<input
								type="text"
								bind:value={editData.lastName}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-secondary">{pilgrim.lastName || '-'}</p>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Email</label>
						{#if isEditing}
							<input
								type="email"
								bind:value={editData.email}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-secondary">{pilgrim.email || '-'}</p>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Phone</label>
						{#if isEditing}
							<input
								type="tel"
								bind:value={editData.phone}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-secondary">{pilgrim.phone || '-'}</p>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Gender</label>
						{#if isEditing}
							<select
								bind:value={editData.gender}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary">
								<option value="">Select</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</select>
						{:else}
							<p class="text-secondary capitalize">{pilgrim.gender || '-'}</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Passport Details -->
			<div class="rounded-4xl border border-gray-100 bg-white p-6">
				<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
					<Icon icon="ph:passport" class="h-5 w-5 text-gray-400" />
					Passport Details
				</h2>

				<div class="space-y-4">
					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Passport Number</label>
						{#if isEditing}
							<input
								type="text"
								bind:value={editData.passportNumber}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="font-mono text-secondary">{pilgrim.passportNumber || '-'}</p>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Expiry Date</label>
						{#if isEditing}
							<input
								type="date"
								bind:value={editData.passportExpiry}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-secondary">{formatDate(pilgrim.passportExpiry)}</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Linked Application -->
			{#if application}
				<div class="rounded-4xl border border-gray-100 bg-white p-6 lg:col-span-2">
					<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
						<Icon icon="heroicons:document-text" class="h-5 w-5 text-gray-400" />
						Linked Application
					</h2>

					<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
						<div>
							<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
								>Application ID</label>
							<a
								href="/admin/applications/{application.$id}"
								class="font-mono text-primary hover:underline">
								{application.$id}
							</a>
						</div>

						<div>
							<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
								>Status</label>
							<span
								class="rounded-full px-3 py-1 text-xs font-bold {getStatusStyle(
									application.status
								)}">
								{formatStatus(application.status)}
							</span>
						</div>

						<div>
							<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
								>Package</label>
							<p class="text-secondary">{packageDetails?.name || 'Unknown Package'}</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Payment Receipt -->
			{#if application?.paymentReceiptId}
				<div class="rounded-4xl border border-gray-100 bg-white p-6 lg:col-span-1">
					<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
						<Icon icon="ph:receipt" class="h-5 w-5 text-gray-400" />
						Payment Receipt
					</h2>

					<div class="space-y-4">
						<div>
							<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase">
								Receipt Status
							</label>
							<span class={getStatusStyle(application.status)}>
								{formatStatus(application.status)}
							</span>
						</div>

						<Button
							onclick={() => viewFile(application.paymentReceiptId, 'No receipt available')}
							variant="primary"
							size="sm"
							text="View Receipt" />
					</div>
				</div>
			{/if}

			<!-- Documents -->
			<div class="rounded-4xl border border-gray-100 bg-white p-6 lg:col-span-2">
				<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
					<Icon icon="heroicons:folder" class="h-5 w-5 text-gray-400" />
					Documents ({documents.length})
				</h2>

				{#if documents.length === 0}
					<div class="py-8 text-center">
						<Icon icon="heroicons:document" class="mx-auto mb-2 h-8 w-8 text-gray-200" />
						<p class="text-sm text-gray-400">No documents uploaded</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each documents as doc}
							<div
								class="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
								<div class="flex grow items-center gap-3">
									<Icon icon="heroicons:document" class="h-5 w-5 text-gray-400" />
									<div class="flex-1">
										<p class="text-sm font-medium text-secondary">{doc.type || 'Document'}</p>
										<p class="text-xs text-gray-400">{doc.fileName || 'Unknown'}</p>
									</div>
								</div>

								<div class="flex items-center gap-2">
									<button
										onclick={() => viewFile(doc.fileId)}
										class="rounded-full border border-primary px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white">
										View
									</button>

									{#if doc.status !== 'approved'}
										<button
											onclick={() => updateDocumentStatus(doc.$id, 'approved')}
											disabled={approvingDocId === doc.$id}
											class="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-600 transition-colors hover:bg-green-100 disabled:opacity-50">
											{approvingDocId === doc.$id ? 'Approving...' : 'Approve'}
										</button>
									{/if}

									{#if doc.status !== 'rejected'}
										<button
											onclick={() => updateDocumentStatus(doc.$id, 'rejected')}
											disabled={approvingDocId === doc.$id}
											class="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50">
											{approvingDocId === doc.$id ? 'Rejecting...' : 'Reject'}
										</button>
									{/if}

									<span
										class="rounded-full px-3 py-1 text-xs font-medium capitalize {doc.status ===
										'approved'
											? 'bg-green-50 text-green-600'
											: doc.status === 'rejected'
												? 'bg-red-50 text-red-600'
												: 'bg-amber-50 text-amber-600'}">
										{doc.status || 'Pending'}
									</span>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
