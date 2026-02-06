<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Modal from '$components/ui/Modal.svelte';
	import Button from '$components/ui/Button.svelte';
	import { getFileUrl } from '$lib/appwrite';

	let isLoading = $state(true);
	let isSaving = $state(false);
	let pkg = $state(null);
	let error = $state(null);
	let isEditing = $state(false);

	// Editable fields
	let editData = $state({});

	// Inclusions management
	let newInclusion = $state('');

	// Image upload state
	let selectedFile = $state(null);
	let imagePreview = $state(null);
	let isUploadingImage = $state(false);
	let fileInputRef = $state(null);

	const packageId = $derived($page.params.id);

	const typeOptions = [
		{ value: 'Hajj', label: 'Hajj' },
		{ value: 'Umrah', label: 'Umrah' }
	];

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
	 * Fetch package data
	 */
	async function fetchPackage() {
		try {
			const response = await fetch(`/api/admin/packages/${packageId}`);
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to fetch package');
			}

			pkg = result.package;

			// Initialize edit data
			editData = {
				name: pkg.name,
				type: pkg.type,
				price: pkg.price,
				description: pkg.description || '',
				duration: pkg.duration || '',
				isActive: pkg.isActive !== false,
				inclusions: pkg.inclusions || [],
				imageId: pkg.imageId || null
			};
		} catch (err) {
			console.error('Failed to fetch package:', err);
			error = err.message;
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Add inclusion
	 */
	function addInclusion() {
		if (newInclusion.trim()) {
			editData.inclusions = [...editData.inclusions, newInclusion.trim()];
			newInclusion = '';
		}
	}

	/**
	 * Remove inclusion
	 */
	function removeInclusion(index) {
		editData.inclusions = editData.inclusions.filter((_, i) => i !== index);
	}

	/**
	 * Handle inclusion keypress
	 */
	function handleInclusionKeypress(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addInclusion();
		}
	}

	/**
	 * Handle file selection
	 */
	function handleFileSelect(event) {
		const file = event.target.files?.[0];
		if (file) {
			selectedFile = file;
			// Create preview
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}

	/**
	 * Clear file selection
	 */
	function clearFileSelection() {
		selectedFile = null;
		imagePreview = null;
		if (fileInputRef) fileInputRef.value = '';
	}

	/**
	 * Upload new image
	 */
	async function uploadImage() {
		if (!selectedFile) return;

		isUploadingImage = true;
		try {
			const formData = new FormData();
			formData.append('file', selectedFile);
			formData.append('packageId', packageId);

			const response = await fetch('/api/admin/packages/upload-image', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to upload image');
			}

			// Update package with new image
			pkg = { ...pkg, imageId: result.fileId, imageUrl: result.imageUrl };
			editData.imageId = result.fileId;
			clearFileSelection();
		} catch (err) {
			console.error('Failed to upload image:', err);
			alert('Failed to upload image: ' + err.message);
		} finally {
			isUploadingImage = false;
		}
	}

	/**
	 * Delete current image
	 */
	async function deleteImage() {
		if (!pkg.imageId) return;
		if (!confirm('Are you sure you want to delete this image?')) return;

		try {
			const response = await fetch(`/api/admin/packages/upload-image?fileId=${pkg.imageId}&packageId=${packageId}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to delete image');
			}

			pkg = { ...pkg, imageId: null, imageUrl: null };
			editData.imageId = null;
		} catch (err) {
			console.error('Failed to delete image:', err);
			alert('Failed to delete image: ' + err.message);
		}
	}

	/**
	 * Save package changes
	 */
	async function savePackage() {
		isSaving = true;
		try {
			// If there's a selected file, upload it first
			if (selectedFile) {
				await uploadImage();
			}

			const response = await fetch(`/api/admin/packages/${packageId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...editData,
					price: parseFloat(editData.price)
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to save changes');
			}

			pkg = result.package;
			isEditing = false;
		} catch (err) {
			console.error('Failed to save package:', err);
			alert('Failed to save changes: ' + err.message);
		} finally {
			isSaving = false;
		}
	}

	/**
	 * Delete package
	 */
	async function deletePackage() {
		if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/packages/${packageId}`, {
				method: 'DELETE'
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to delete package');
			}

			goto('/admin/packages');
		} catch (err) {
			console.error('Failed to delete package:', err);
			alert('Failed to delete package: ' + err.message);
		}
	}

	/**
	 * Cancel editing
	 */
	function cancelEdit() {
		// Reset to original values
		editData = {
			name: pkg.name,
			type: pkg.type,
			price: pkg.price,
			description: pkg.description || '',
			duration: pkg.duration || '',
			isActive: pkg.isActive !== false,
			inclusions: pkg.inclusions || [],
			imageId: pkg.imageId || null
		};
		clearFileSelection();
		isEditing = false;
	}

	onMount(() => {
		fetchPackage();
	});
</script>

{#if isLoading}
	<Modal text="Loading package details..." />
{/if}

{#if isSaving}
	<Modal text="Saving changes..." />
{/if}

{#if isUploadingImage}
	<Modal text="Uploading image..." />
{/if}

<div class="mx-auto w-full max-w-4xl space-y-8 p-6 md:p-10" in:fade={{ duration: 500 }}>
	<!-- Back Button & Header -->
	<div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
		<div>
			<a
				href="/admin/packages"
				class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary">
				<Icon icon="heroicons:arrow-left" class="h-4 w-4" />
				Back to Packages
			</a>

			{#if pkg}
				<h1 class="text-3xl font-medium tracking-tighter text-secondary md:text-4xl">
					{pkg.name}
				</h1>
				<div class="mt-2 flex items-center gap-3">
					<span class="rounded-full px-3 py-1 text-xs font-bold {getTypeStyle(pkg.type)}">
						{pkg.type}
					</span>
					{#if pkg.isActive}
						<span class="text-xs font-medium text-emerald-600">Active</span>
					{:else}
						<span class="text-xs font-medium text-gray-400">Inactive</span>
					{/if}
				</div>
			{/if}
		</div>

		<div class="flex flex-wrap items-center gap-3">
			{#if isEditing}
				<Button onclick={cancelEdit} variant="secondary" text="Cancel" size="sm" />
				<Button onclick={savePackage} variant="primary" text="Save Changes" size="sm" />
			{:else}
				<Button onclick={() => (isEditing = true)} variant="secondary" text="Edit" size="sm" />
				<button
					onclick={deletePackage}
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
	{:else if pkg}
		<div class="space-y-6">
			<!-- Package Image -->
			<div class="rounded-4xl border border-gray-100 bg-white p-6">
				<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
					<Icon icon="heroicons:photo" class="h-5 w-5 text-gray-400" />
					Package Image
				</h2>

				{#if isEditing}
					<div class="space-y-4">
						{#if pkg.imageId && !imagePreview}
							<!-- Current image with option to change -->
							<div class="relative">
								<img src={getFileUrl(pkg.imageId)} alt={pkg.name} class="h-64 w-full rounded-xl object-cover" />
								<button
									type="button"
									onclick={deleteImage}
									class="absolute top-3 right-3 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
								>
									<Icon icon="heroicons:trash" class="h-4 w-4" />
								</button>
							</div>
							<p class="text-center text-sm text-gray-500">or upload a new image to replace</p>
						{/if}

						<div class="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">
							{#if !imagePreview}
								<label class="flex cursor-pointer flex-col items-center justify-center gap-2 py-6">
									<Icon icon="heroicons:cloud-arrow-up" class="h-10 w-10 text-gray-400" />
									<span class="text-sm font-medium text-gray-600">
										{pkg.imageId ? 'Upload new image' : 'Click to upload package image'}
									</span>
									<span class="text-xs text-gray-400">JPG, PNG or WebP (recommended 800x600)</span>
									<input
										bind:this={fileInputRef}
										type="file"
										accept="image/*"
										onchange={handleFileSelect}
										class="hidden"
									/>
								</label>
							{:else}
								<div class="relative">
									<img src={imagePreview} alt="Preview" class="mx-auto h-64 rounded-lg object-contain shadow-sm" />
									<button
										type="button"
										onclick={clearFileSelection}
										class="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
									>
										<Icon icon="heroicons:x-mark" class="h-4 w-4" />
									</button>
								</div>
								<div class="mt-4 flex justify-center">
									<Button onclick={uploadImage} variant="primary" text="Upload Now" size="sm" />
								</div>
							{/if}
						</div>
					</div>
				{:else if pkg.imageId}
					<div class="overflow-hidden rounded-2xl">
						<img src={getFileUrl(pkg.imageId)} alt={pkg.name} class="h-64 w-full object-cover" />
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center gap-2 py-12 text-gray-400">
						<Icon icon="heroicons:photo" class="h-12 w-12" />
						<p class="text-sm">No image uploaded</p>
						<p class="text-xs">Click Edit to upload an image</p>
					</div>
				{/if}
			</div>

			<!-- Package Details -->
			<div class="rounded-4xl border border-gray-100 bg-white p-6">
				<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
					<Icon icon="heroicons:information-circle" class="h-5 w-5 text-gray-400" />
					Package Details
				</h2>

				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div class="sm:col-span-2">
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Package Name</label>
						{#if isEditing}
							<input
								type="text"
								bind:value={editData.name}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-secondary">{pkg.name || '-'}</p>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Type</label>
						{#if isEditing}
							<select
								bind:value={editData.type}
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary">
								{#each typeOptions as opt}
									<option value={opt.value}>{opt.label}</option>
								{/each}
							</select>
						{:else}
							<span class="inline-flex rounded-full px-3 py-1 text-xs font-bold {getTypeStyle(pkg.type)}">
								{pkg.type}
							</span>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Price</label>
						{#if isEditing}
							<input
								type="number"
								bind:value={editData.price}
								min="0"
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-xl font-bold text-secondary">{formatPrice(pkg.price)}</p>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Duration</label>
						{#if isEditing}
							<input
								type="text"
								bind:value={editData.duration}
								placeholder="e.g., 14 Days / 13 Nights"
								class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
						{:else}
							<p class="text-secondary">{pkg.duration || '-'}</p>
						{/if}
					</div>

					<div>
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Status</label>
						{#if isEditing}
							<label class="flex cursor-pointer items-center gap-3">
								<input
									type="checkbox"
									bind:checked={editData.isActive}
									class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" />
								<span class="text-sm text-secondary">Active (visible to users)</span>
							</label>
						{:else if pkg.isActive}
							<span class="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
								<span class="h-2 w-2 rounded-full bg-emerald-500"></span>
								Active
							</span>
						{:else}
							<span class="inline-flex items-center gap-1 text-sm font-medium text-gray-400">
								<span class="h-2 w-2 rounded-full bg-gray-300"></span>
								Inactive
							</span>
						{/if}
					</div>

					<div class="sm:col-span-2">
						<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
							>Description</label>
						{#if isEditing}
							<textarea
								bind:value={editData.description}
								rows="4"
								class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-secondary outline-none focus:border-primary"
							></textarea>
						{:else}
							<p class="text-secondary whitespace-pre-wrap">{pkg.description || '-'}</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Inclusions -->
			<div class="rounded-4xl border border-gray-100 bg-white p-6">
				<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
					<Icon icon="heroicons:check-circle" class="h-5 w-5 text-gray-400" />
					What's Included
				</h2>

				{#if isEditing}
					<div class="space-y-4">
						<div class="flex gap-2">
							<input
								type="text"
								bind:value={newInclusion}
								onkeypress={handleInclusionKeypress}
								placeholder="Add an inclusion..."
								class="h-10 flex-1 rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
							<Button onclick={addInclusion} variant="secondary" text="Add" size="sm" disabled={!newInclusion.trim()} />
						</div>

						{#if editData.inclusions.length > 0}
							<div class="space-y-2">
								{#each editData.inclusions as inclusion, index}
									<div class="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
										<Icon icon="heroicons:check" class="h-4 w-4 text-emerald-500" />
										<span class="flex-1 text-sm text-secondary">{inclusion}</span>
										<button
											type="button"
											onclick={() => removeInclusion(index)}
											class="text-gray-400 hover:text-red-500">
											<Icon icon="heroicons:x-mark" class="h-4 w-4" />
										</button>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-sm text-gray-400">No inclusions added yet.</p>
						{/if}
					</div>
				{:else if pkg.inclusions && pkg.inclusions.length > 0}
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{#each pkg.inclusions as inclusion}
							<div class="flex items-center gap-2">
								<Icon icon="heroicons:check-circle" class="h-5 w-5 text-emerald-500" />
								<span class="text-sm text-secondary">{inclusion}</span>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-400">No inclusions specified</p>
				{/if}
			</div>
		</div>
	{/if}
</div>
