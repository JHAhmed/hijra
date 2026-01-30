<script>
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import Button from '$components/ui/Button.svelte';
	import Modal from '$components/ui/Modal.svelte';
	import { Toaster, toast } from 'svelte-sonner';

	let batch = $state(null);
	let isLoading = $state(true);
	let error = $state(null);
	
	// Tracking state
	let trackingCode = $state(null);
	let isSharing = $state(false);
	let currentActivity = $state('');
	let watchId = $state(null);
	let lastLocation = $state(null);
	let locationUpdateInterval = $state(null);
	let isGeneratingCode = $state(false);

	// Image upload state
	let journeyImages = $state([]);
	let isUploadingImage = $state(false);
	let uploadError = $state(null);
	let selectedFile = $state(null);
	let imageCaption = $state('');
	let imageActivity = $state('');
	let fileInputRef = $state(null);
	let imagePreview = $state(null);

	const batchId = $derived($page.params.id);

	const activities = [
		{ value: 'tawaf', label: 'Tawaf', icon: 'mdi:rotate-360', description: 'Circling the Kaaba' },
		{ value: 'sai', label: "Sa'i", icon: 'mdi:walk', description: 'Walking between hills' },
		{ value: 'mina', label: 'At Mina', icon: 'mdi:tent', description: 'Stay at Mina' },
		{ value: 'arafat', label: 'At Arafat', icon: 'mdi:weather-sunny', description: 'Day of Arafat' },
		{ value: 'muzdalifah', label: 'At Muzdalifah', icon: 'mdi:weather-night', description: 'Night at Muzdalifah' },
		{ value: 'jamarat', label: 'At Jamarat', icon: 'mdi:target', description: 'Stoning ritual' },
		{ value: 'resting', label: 'Resting', icon: 'mdi:bed', description: 'Hotel/rest time' },
		{ value: 'traveling', label: 'Traveling', icon: 'mdi:bus', description: 'In transit' }
	];

	async function fetchBatchData() {
		try {
			// First get batch details
			const batchRes = await fetch(`/api/admin/batches/${batchId}`);
			const batchData = await batchRes.json();

			if (!batchRes.ok) {
				throw new Error(batchData.error || 'Failed to fetch batch');
			}

			batch = batchData.batch;

			// Then get tracking data
			const trackingRes = await fetch(`/api/admin/batches/${batchId}/tracking`);
			const trackingData = await trackingRes.json();

			if (trackingRes.ok && trackingData.success) {
				trackingCode = trackingData.trackingCode;
				isSharing = trackingData.trackingActive || false;
				currentActivity = trackingData.currentActivity || '';
				
				if (isSharing) {
					startLocationWatch();
				}
			}

			// Fetch journey images
			await fetchImages();
		} catch (err) {
			console.error('Failed to fetch batch:', err);
			error = err.message;
		} finally {
			isLoading = false;
		}
	}

	async function fetchImages() {
		try {
			const response = await fetch(`/api/tracking-images?batchId=${batchId}`);
			const data = await response.json();

			if (response.ok && data.success) {
				journeyImages = data.images || [];
			}
		} catch (err) {
			console.error('Failed to fetch images:', err);
		}
	}

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

	function clearFileSelection() {
		selectedFile = null;
		imagePreview = null;
		imageCaption = '';
		imageActivity = '';
		if (fileInputRef) fileInputRef.value = '';
	}

	async function uploadImage() {
		if (!selectedFile) return;

		isUploadingImage = true;
		uploadError = null;

		try {
			const formData = new FormData();
			formData.append('file', selectedFile);
			formData.append('batchId', batchId);
			formData.append('caption', imageCaption);
			formData.append('activity', imageActivity || currentActivity || '');
			formData.append('uploadedBy', 'admin');

			const response = await fetch('/api/tracking-images', {
				method: 'POST',
				body: formData
			});

			const data = await response.json();

			if (response.ok && data.success) {
				journeyImages = [data.image, ...journeyImages];
				clearFileSelection();
				toast.success('Photo uploaded successfully!');
			} else {
				uploadError = data.error || 'Failed to upload image';
				toast.error(uploadError);
			}
		} catch (err) {
			console.error('Failed to upload image:', err);
			uploadError = 'Failed to upload image';
			toast.error(uploadError);
		} finally {
			isUploadingImage = false;
		}
	}

	async function deleteImage(imageId) {
		if (!confirm('Are you sure you want to delete this image?')) return;

		try {
			const response = await fetch(`/api/tracking-images?imageId=${imageId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				journeyImages = journeyImages.filter(img => img.$id !== imageId);
				toast.success('Photo deleted');
			} else {
				toast.error('Failed to delete photo');
			}
		} catch (err) {
			console.error('Failed to delete image:', err);
			toast.error('Failed to delete photo');
		}
	}

	async function generateTrackingCode() {
		isGeneratingCode = true;
		try {
			const response = await fetch(`/api/admin/batches/${batchId}/tracking`, {
				method: 'POST'
			});
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to generate tracking code');
			}

			trackingCode = data.trackingCode;
			toast.success('Tracking code generated!');
		} catch (err) {
			toast.error(err.message);
		} finally {
			isGeneratingCode = false;
		}
	}

	async function toggleSharing() {
		if (!trackingCode) {
			toast.error('Please generate a tracking code first');
			return;
		}

		const newState = !isSharing;

		try {
			const response = await fetch(`/api/admin/batches/${batchId}/tracking`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ trackingActive: newState })
			});

			if (!response.ok) {
				throw new Error('Failed to update sharing status');
			}

			isSharing = newState;

			if (newState) {
				toast.success('Location sharing enabled');
				startLocationWatch();
			} else {
				toast.success('Location sharing paused');
				stopLocationWatch();
			}
		} catch (err) {
			toast.error(err.message);
		}
	}

	function startLocationWatch() {
		if (!navigator.geolocation) {
			toast.error('Geolocation is not supported by your browser');
			return;
		}

		watchId = navigator.geolocation.watchPosition(
			async (position) => {
				lastLocation = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				};
				await updateTracking();
			},
			(geoError) => {
				console.error('Geolocation error:', geoError);
				if (geoError.code === geoError.PERMISSION_DENIED) {
					toast.error('Location permission denied. Please enable it in your browser settings.');
				}
			},
			{
				enableHighAccuracy: true,
				maximumAge: 30000,
				timeout: 10000
			}
		);

		// Periodic updates
		locationUpdateInterval = setInterval(async () => {
			if (lastLocation && isSharing) {
				await updateTracking();
			}
		}, 30000);
	}

	function stopLocationWatch() {
		if (watchId !== null) {
			navigator.geolocation.clearWatch(watchId);
			watchId = null;
		}
		if (locationUpdateInterval) {
			clearInterval(locationUpdateInterval);
			locationUpdateInterval = null;
		}
	}

	async function updateTracking() {
		if (!trackingCode || !isSharing) return;

		try {
			const body = {};
			
			if (lastLocation) {
				body.latitude = lastLocation.latitude;
				body.longitude = lastLocation.longitude;
			}
			
			if (currentActivity) {
				body.currentActivity = currentActivity;
			}

			await fetch(`/api/admin/batches/${batchId}/tracking`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
		} catch (err) {
			console.error('Failed to update tracking:', err);
		}
	}

	async function handleActivityToggle(stageValue) {
		currentActivity = currentActivity === stageValue ? '' : stageValue;
		if (isSharing) {
			await updateTracking();
			if (currentActivity) {
				const stage = activities.find(s => s.value === currentActivity);
				toast.success(`Activity: ${stage?.label}`);
			} else {
				toast.success('Activity cleared');
			}
		}
	}

	function copyLink() {
		const url = `${window.location.origin}/track/${trackingCode}`;
		navigator.clipboard.writeText(url);
		toast.success('Link copied to clipboard!');
	}

	function copyGuideLink() {
		const url = `${window.location.origin}/guide/batches/${batchId}/track`;
		navigator.clipboard.writeText(url);
		toast.success('Guide link copied to clipboard!');
	}

	function shareLink() {
		const url = `${window.location.origin}/track/${trackingCode}`;
		if (navigator.share) {
			navigator.share({
				title: `Track ${batch?.name || 'Batch'} Journey`,
				text: `Follow the ${batch?.name || 'batch'} pilgrimage journey in real-time`,
				url
			});
		} else {
			copyLink();
		}
	}

	function getActivityInfo(activity) {
		const found = activities.find(a => a.value === activity);
		return found || { value: activity, label: activity, icon: 'mdi:map-marker' };
	}

	onMount(() => {
		fetchBatchData();
	});

	onDestroy(() => {
		stopLocationWatch();
	});
</script>

<Toaster />

{#if isLoading}
	<Modal text="Loading batch tracking..." />
{/if}

<div class="mx-auto w-full max-w-4xl space-y-8 p-6 md:p-10">
	<!-- Header -->
	<div>
		<a
			href="/admin/batches/{batchId}"
			class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary">
			<Icon icon="heroicons:arrow-left" class="h-4 w-4" />
			Back to Batch
		</a>

		{#if batch}
			<h1 class="text-3xl font-medium tracking-tighter text-secondary md:text-4xl">
				{batch.name} - Tracking
			</h1>
			<p class="mt-2 text-gray-500">Manage live location sharing for this batch</p>
		{/if}
	</div>

	{#if error}
		<div class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
			<Icon icon="heroicons:exclamation-triangle" class="mx-auto mb-2 h-8 w-8 text-red-500" />
			<p class="font-medium text-red-600">{error}</p>
		</div>
	{:else}
		<div class="space-y-6">
			<!-- Tracking Code Card -->
			<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-4 flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
						<Icon icon="mdi:map-marker-radius" class="h-5 w-5 text-emerald-600" />
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">Live Location Sharing</h3>
						<p class="text-sm text-gray-500">Share this batch's journey with pilgrims' families</p>
					</div>
				</div>

				{#if !trackingCode}
					<!-- No tracking code yet -->
					<div class="rounded-xl bg-gray-50 p-6 text-center">
						<Icon icon="mdi:qrcode" class="mx-auto mb-3 h-12 w-12 text-gray-300" />
						<p class="mb-4 text-gray-600">No tracking code generated for this batch yet.</p>
						<Button
							onclick={generateTrackingCode}
							variant="primary"
							text={isGeneratingCode ? 'Generating...' : 'Generate Tracking Code'}
							disabled={isGeneratingCode}
						/>
					</div>
				{:else}
					<div class="space-y-4">
						<!-- Tracking Code Display -->
						<div class="rounded-xl {isSharing ? 'bg-emerald-50' : 'bg-gray-100'} p-4">
							<div class="mb-2 flex items-center justify-between">
								<span class="text-sm font-medium {isSharing ? 'text-emerald-800' : 'text-gray-600'}">
									Tracking Code
								</span>
								{#if isSharing}
									<span class="relative flex h-2.5 w-2.5">
										<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
										<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
									</span>
								{:else}
									<span class="text-xs font-medium text-gray-500 uppercase">Paused</span>
								{/if}
							</div>
							<p class="font-mono text-2xl font-bold {isSharing ? 'text-emerald-900' : 'text-gray-700'}">{trackingCode}</p>
						</div>

						<!-- Share Buttons -->
						<div class="flex gap-2">
							<button
								onclick={copyLink}
								class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
							>
								<Icon icon="mdi:content-copy" class="h-4 w-4" />
								Copy Link
							</button>
							<button
								onclick={copyGuideLink}
								class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
							>
								<Icon icon="mdi:content-copy" class="h-4 w-4" />
								Copy Guide Link
							</button>
							<button
								onclick={shareLink}
								class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
							>
								<Icon icon="mdi:share-variant" class="h-4 w-4" />
								Share
							</button>
						</div>

						<!-- Sharing Toggle -->
						<div class="flex items-center justify-between rounded-xl border border-gray-200 p-4">
							<div class="flex items-center gap-3">
								<Icon 
									icon={isSharing ? 'mdi:broadcast' : 'mdi:broadcast-off'} 
									class="h-5 w-5 {isSharing ? 'text-emerald-600' : 'text-gray-400'}" 
								/>
								<div>
									<p class="text-sm font-medium text-gray-900">
										{isSharing ? 'Sharing Active' : 'Sharing Paused'}
									</p>
									<p class="text-xs text-gray-500">
										{isSharing ? 'Location is being shared with families' : 'Toggle to start sharing'}
									</p>
								</div>
							</div>
							<button
								onclick={toggleSharing}
								aria-label={isSharing ? 'Disable location sharing' : 'Enable location sharing'}
								class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {isSharing ? 'bg-emerald-600' : 'bg-gray-300'}"
							>
								<span
									class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform {isSharing ? 'translate-x-6' : 'translate-x-1'}"
								></span>
							</button>
						</div>

						<!-- Activity Selection -->
						<div>
							<p class="mb-3 text-sm font-medium text-gray-700">Current Activity</p>
							<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
								{#each activities as activity}
									<button
										onclick={() => handleActivityToggle(activity.value)}
										class="flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all
											{currentActivity === activity.value 
												? 'border-emerald-500 bg-emerald-50 shadow-sm' 
												: 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}"
									>
										<div class="flex h-10 w-10 items-center justify-center rounded-lg
											{currentActivity === activity.value ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}">
											<Icon icon={activity.icon} class="h-5 w-5" />
										</div>
										<div class="text-center">
											<p class="text-xs font-semibold {currentActivity === activity.value ? 'text-emerald-900' : 'text-gray-900'}">
												{activity.label}
											</p>
										</div>
										{#if currentActivity === activity.value}
											<Icon icon="mdi:check-circle" class="h-4 w-4 text-emerald-500" />
										{/if}
									</button>
								{/each}
							</div>
						</div>

						<!-- Location Status -->
						{#if isSharing}
							{#if lastLocation}
								<div class="flex items-center gap-2 text-sm text-emerald-600">
									<Icon icon="mdi:crosshairs-gps" class="h-4 w-4" />
									<span>Location tracking active</span>
								</div>
							{:else}
								<div class="flex items-center gap-2 text-sm text-amber-600">
									<Icon icon="mdi:crosshairs-question" class="h-4 w-4" />
									<span>Waiting for location permission...</span>
								</div>
							{/if}
						{/if}
					</div>
				{/if}
			</div>

			<!-- Journey Photos Card -->
			<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-4 flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
						<Icon icon="mdi:camera" class="h-5 w-5 text-blue-600" />
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">Journey Photos</h3>
						<p class="text-sm text-gray-500">Upload photos to share with pilgrims and families</p>
					</div>
				</div>

				<div class="space-y-6">
					<!-- Upload Form -->
					<div class="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">
						{#if !selectedFile}
							<label class="flex cursor-pointer flex-col items-center justify-center gap-2 py-4">
								<Icon icon="mdi:cloud-upload" class="h-10 w-10 text-gray-400" />
								<span class="text-sm font-medium text-gray-600">Click to upload a photo</span>
								<span class="text-xs text-gray-400">JPG, PNG or WebP (max 10MB)</span>
								<input
									bind:this={fileInputRef}
									type="file"
									accept="image/*"
									onchange={handleFileSelect}
									class="hidden"
								/>
							</label>
						{:else}
							<div class="space-y-4">
								<!-- Preview -->
								<div class="relative">
									<img src={imagePreview} alt="Preview" class="mx-auto h-48 rounded-lg object-contain shadow-sm" />
									<button
										onclick={clearFileSelection}
										class="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
									>
										<Icon icon="mdi:close" class="h-4 w-4" />
									</button>
								</div>
								
								<div class="grid gap-4 sm:grid-cols-2">
									<!-- Caption Input -->
									<div>
										<label class="block">
											<span class="mb-1 block text-xs font-medium text-gray-500">Caption</span>
											<input
												type="text"
												bind:value={imageCaption}
												placeholder="Add a caption..."
												class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
											/>
										</label>
									</div>

									<!-- Activity Selector -->
									<div>
										<label class="block">
											<span class="mb-1 block text-xs font-medium text-gray-500">Activity Context</span>
											<select
												bind:value={imageActivity}
												class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
											>
												<option value="">{currentActivity ? `Current: ${getActivityInfo(currentActivity).label}` : 'No specific activity'}</option>
												{#each activities as activity}
													<option value={activity.value}>{activity.label}</option>
												{/each}
											</select>
										</label>
									</div>
								</div>

								{#if uploadError}
									<p class="text-sm text-red-500">{uploadError}</p>
								{/if}

								<!-- Upload Button -->
								<div class="flex justify-end gap-2">
									<Button
										onclick={clearFileSelection}
										variant="secondary"
										text="Cancel"
										size="sm"
									/>
									<Button
										onclick={uploadImage}
										variant="primary"
										text={isUploadingImage ? 'Uploading...' : 'Upload Photo'}
										size="sm"
										disabled={isUploadingImage}
									/>
								</div>
							</div>
						{/if}
					</div>

					<!-- Image Gallery -->
					{#if journeyImages.length > 0}
						<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
							{#each journeyImages as image (image.$id)}
								<div class="group relative aspect-square overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
									<img
										src={image.imageUrl}
										alt={image.caption || 'Journey photo'}
										class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
									<div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
										{#if image.caption}
											<p class="truncate text-xs text-white" title={image.caption}>{image.caption}</p>
										{/if}
										{#if image.activity}
											<div class="mt-1 flex items-center gap-1 text-[10px] text-gray-300">
												<Icon icon={getActivityInfo(image.activity).icon} class="h-3 w-3" />
												<span class="truncate">{getActivityInfo(image.activity).label}</span>
											</div>
										{/if}
									</div>
									<button
										onclick={() => deleteImage(image.$id)}
										class="absolute top-2 right-2 rounded-full bg-red-500/90 p-1.5 text-white opacity-0 shadow-sm transition-all hover:bg-red-600 group-hover:opacity-100"
										title="Delete photo"
									>
										<Icon icon="mdi:trash-can" class="h-3.5 w-3.5" />
									</button>
								</div>
							{/each}
						</div>
					{:else}
						<div class="py-8 text-center text-gray-400">
							<p>No photos uploaded yet. Enable sharing to allow pilgrims to see photos.</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Info Card -->
			<div class="rounded-xl border border-gray-200 bg-white p-4">
				<div class="flex gap-3">
					<Icon icon="mdi:information" class="h-5 w-5 shrink-0 text-gray-400" />
					<div class="text-sm text-gray-600">
						<p class="font-medium text-gray-700">How it works</p>
						<ul class="mt-1 list-inside list-disc space-y-1 text-gray-500">
							<li>Generate a tracking code for this batch</li>
							<li>Toggle sharing on to broadcast location</li>
							<li>Pilgrims and their families can view the tracking page</li>
							<li>Select the current activity to keep families informed</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
