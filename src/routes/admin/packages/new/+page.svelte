<script>
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import Modal from '$components/ui/Modal.svelte';
	import Button from '$components/ui/Button.svelte';

	let isLoading = $state(false);
	let error = $state(null);

	// Form data
	let formData = $state({
		name: '',
		type: 'umrah',
		price: '',
		description: '',
		duration: 5,
		isActive: true,
		inclusions: [],
		imageId: null
	});

	// Inclusions management
	let newInclusion = $state('');

	// Image upload state
	let selectedFile = $state(null);
	let imagePreview = $state(null);
	let isUploadingImage = $state(false);
	let fileInputRef = $state(null);

	const typeOptions = [
		{ value: 'hajj', label: 'Hajj' },
		{ value: 'umrah', label: 'Umrah' }
	];

	/**
	 * Add inclusion to list
	 */
	function addInclusion() {
		if (newInclusion.trim()) {
			formData.inclusions = [...formData.inclusions, newInclusion.trim()];
			newInclusion = '';
		}
	}

	/**
	 * Remove inclusion from list
	 */
	function removeInclusion(index) {
		formData.inclusions = formData.inclusions.filter((_, i) => i !== index);
	}

	/**
	 * Handle inclusion input keypress
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
		formData.imageId = null;
		if (fileInputRef) fileInputRef.value = '';
	}

	/**
	 * Create package
	 */
	async function createPackage() {
		if (!formData.name || !formData.type || !formData.price) {
			error = 'Please fill in required fields: Name, Type, and Price';
			return;
		}

		isLoading = true;
		error = null;

		try {
			// First create the package
			const response = await fetch('/api/admin/packages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					price: parseFloat(formData.price)
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to create package');
			}

			const packageId = result.package.$id;

			// If there's a selected file, upload it
			if (selectedFile) {
				isUploadingImage = true;
				const imageFormData = new FormData();
				imageFormData.append('file', selectedFile);
				imageFormData.append('packageId', packageId);

				const uploadResponse = await fetch('/api/admin/packages/upload-image', {
					method: 'POST',
					body: imageFormData
				});

				if (!uploadResponse.ok) {
					console.warn('Failed to upload image, but package was created');
				}
			}

			goto(`/admin/packages/${packageId}`);
		} catch (err) {
			console.error('Failed to create package:', err);
			error = err.message;
		} finally {
			isLoading = false;
			isUploadingImage = false;
		}
	}
</script>

{#if isLoading}
	<Modal text={isUploadingImage ? "Uploading image..." : "Creating package..."} />
{/if}

<div class="mx-auto w-full max-w-4xl space-y-8 p-6 md:p-10" in:fade={{ duration: 500 }}>
	<!-- Header -->
	<div>
		<a
			href="/admin/packages"
			class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary">
			<Icon icon="heroicons:arrow-left" class="h-4 w-4" />
			Back to Packages
		</a>

		<h1 class="text-3xl font-medium tracking-tighter text-secondary md:text-4xl">
			Create New Package
		</h1>
		<p class="mt-2 text-gray-500">
			Add a new travel package for pilgrims
		</p>
	</div>

	{#if error}
		<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
			{error}
		</div>
	{/if}

	<form onsubmit={(e) => { e.preventDefault(); createPackage(); }} class="space-y-6">
		<!-- Package Image -->
		<div class="rounded-4xl border border-gray-100 bg-white p-6">
			<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
				<Icon icon="heroicons:photo" class="h-5 w-5 text-gray-400" />
				Package Image
			</h2>

			<div class="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">
				{#if !imagePreview}
					<label class="flex cursor-pointer flex-col items-center justify-center gap-2 py-8">
						<Icon icon="heroicons:cloud-arrow-up" class="h-12 w-12 text-gray-400" />
						<span class="text-sm font-medium text-gray-600">Click to upload package image</span>
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
				{/if}
			</div>
		</div>

		<!-- Basic Info -->
		<div class="rounded-4xl border border-gray-100 bg-white p-6">
			<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
				<Icon icon="heroicons:information-circle" class="h-5 w-5 text-gray-400" />
				Basic Information
			</h2>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div class="sm:col-span-2">
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Package Name <span class="text-red-500">*</span></label>
					<input
						type="text"
						bind:value={formData.name}
						placeholder="e.g., Premium Umrah Package"
						required
						class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
				</div>

				<div>
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Type <span class="text-red-500">*</span></label>
					<select
						bind:value={formData.type}
						class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary">
						{#each typeOptions as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Price (INR) <span class="text-red-500">*</span></label>
					<input
						type="number"
						bind:value={formData.price}
						placeholder="e.g., 150000"
						required
						min="0"
						class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
				</div>

				<div>
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Duration</label>
					<input
						type="text"
						bind:value={formData.duration}
						placeholder="e.g., 14 Days / 13 Nights"
						class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
				</div>

				<div>
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Status</label>
					<label class="flex cursor-pointer items-center gap-3">
						<input
							type="checkbox"
							bind:checked={formData.isActive}
							class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" />
						<span class="text-sm text-secondary">Active (visible to users)</span>
					</label>
				</div>

				<div class="sm:col-span-2">
					<label class="mb-2 block text-xs font-bold tracking-wider text-gray-400 uppercase"
						>Description</label>
					<textarea
						bind:value={formData.description}
						rows="4"
						placeholder="Describe the package details, highlights, and what makes it special..."
						class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-secondary outline-none focus:border-primary"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Inclusions -->
		<div class="rounded-4xl border border-gray-100 bg-white p-6">
			<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-secondary">
				<Icon icon="heroicons:check-circle" class="h-5 w-5 text-gray-400" />
				What's Included
			</h2>

			<div class="space-y-4">
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={newInclusion}
						onkeypress={handleInclusionKeypress}
						placeholder="e.g., 5-star hotel accommodation"
						class="h-10 flex-1 rounded-lg border border-gray-200 px-3 text-sm text-secondary outline-none focus:border-primary" />
					<Button onclick={addInclusion} variant="secondary" text="Add" size="sm" disabled={!newInclusion.trim()} />
				</div>

				{#if formData.inclusions.length > 0}
					<div class="space-y-2">
						{#each formData.inclusions as inclusion, index}
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
					<p class="text-sm text-gray-400">No inclusions added yet. Add items that are included in this package.</p>
				{/if}
			</div>
		</div>

		<!-- Actions -->
		<div class="flex justify-end gap-4">
			<Button href="/admin/packages" variant="secondary" text="Cancel" size="md" />
			<Button type="submit" variant="primary" text="Create Package" size="md" />
		</div>
	</form>
</div>
