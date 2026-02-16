<script>
	import { onMount, onDestroy } from 'svelte';
	import { authStore } from '$lib/auth.svelte';
	import Icon from '@iconify/svelte';
	import Button from '$components/ui/Button.svelte';

	let isLoading = $state(true);
	let trackingData = $state(null);
	let error = $state(null);
	let refreshInterval;
	let locationName = $state(null);
	let locationLoading = $state(false);

	// Image upload state
	// Image gallery state
	let journeyImages = $state([]);

	// All activities with their metadata
	const allActivities = {
		tawaf: { icon: 'mdi:rotate-360', label: 'Performing Tawaf', color: 'text-emerald-600' },
		sai: { icon: 'mdi:walk', label: "Performing Sa'i", color: 'text-blue-600' },
		mina: { icon: 'mdi:tent', label: 'At Mina', color: 'text-amber-600' },
		arafat: { icon: 'mdi:weather-sunny', label: 'At Arafat', color: 'text-orange-600' },
		muzdalifah: { icon: 'mdi:weather-night', label: 'At Muzdalifah', color: 'text-indigo-600' },
		jamarat: { icon: 'mdi:target', label: 'At Jamarat', color: 'text-red-600' },
		resting: { icon: 'mdi:bed', label: 'Resting', color: 'text-gray-600' },
		traveling: { icon: 'mdi:bus', label: 'Traveling', color: 'text-purple-600' }
	};

	// Activity keys for each package type
	const umrahActivities = ['tawaf', 'sai', 'resting', 'traveling'];
	const hajjActivities = ['tawaf', 'sai', 'mina', 'arafat', 'muzdalifah', 'jamarat', 'resting', 'traveling'];

	// Filter activities based on package type
	const activities = $derived(() => {
		const packageType = trackingData?.packageType?.toLowerCase();
		const activityKeys = packageType === 'umrah' ? umrahActivities : hajjActivities;
		return Object.fromEntries(
			Object.entries(allActivities).filter(([key]) => activityKeys.includes(key))
		);
	});

	function getActivityInfo(activity) {
		if (!activity) return { icon: 'mdi:map-marker-question', label: 'Activity not set', color: 'text-gray-400' };
		return allActivities[activity.toLowerCase()] || { icon: 'mdi:map-marker', label: activity, color: 'text-gray-600' };
	}

	function formatLastUpdated(timestamp) {
		if (!timestamp) return 'Never';
		
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		
		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
		
		const diffHours = Math.floor(diffMins / 60);
		if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
		
		return date.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	async function reverseGeocode(lat, lon) {
		locationLoading = true;
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
				{
					headers: {
						'User-Agent': 'HijrahPortal/1.0'
					}
				}
			);
			if (response.ok) {
				const data = await response.json();
				if (data.display_name) {
					locationName = data.display_name;
				}
			}
		} catch (err) {
			console.error('Failed to reverse geocode:', err);
		} finally {
			locationLoading = false;
		}
	}

	async function fetchTrackingData() {
		if (!authStore?.user) {
			isLoading = false;
			return;
		}

		try {
			const response = await fetch(`/api/user/batch-tracking?userId=${authStore.user.$id}`);
			const data = await response.json();

			if (response.ok && data.success) {
				trackingData = data;
				
				// Reverse geocode if coordinates available
				if (data.latitude && data.longitude) {
					reverseGeocode(data.latitude, data.longitude);
				}
			} else {
				error = data.error || data.message;
			}
		} catch (err) {
			console.error('Failed to fetch tracking data:', err);
			error = 'Failed to load tracking information';
		} finally {
			isLoading = false;
		}
	}

	function copyLink() {
		if (trackingData?.trackingCode) {
			const url = `${window.location.origin}/track/${trackingData.trackingCode}`;
			navigator.clipboard.writeText(url);
		}
	}

	function shareLink() {
		if (trackingData?.trackingCode) {
			const url = `${window.location.origin}/track/${trackingData.trackingCode}`;
			if (navigator.share) {
				navigator.share({
					title: `Track ${trackingData.batchName} Journey`,
					text: `Follow our Hajj/Umrah journey in real-time`,
					url
				});
			} else {
				copyLink();
			}
		}
	}

	async function fetchImages() {
		if (!trackingData?.batchId) return;

		try {
			const response = await fetch(`/api/tracking-images?batchId=${trackingData.batchId}`);
			const data = await response.json();

			if (response.ok && data.success) {
				journeyImages = data.images || [];
			}
		} catch (err) {
			console.error('Failed to fetch images:', err);
		}
	}

	onMount(() => {
		fetchTrackingData();
		// Refresh every 30 seconds
		refreshInterval = setInterval(fetchTrackingData, 30000);
	});

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});

	const activityInfo = $derived(trackingData?.currentActivity ? getActivityInfo(trackingData.currentActivity) : null);

	// Fetch images when tracking data changes
	$effect(() => {
		if (trackingData?.batchId) {
			fetchImages();
		}
	});
</script>

<svelte:head>
	<title>Pilgrim Tracking | Hijrah Portal</title>
	<meta name="description" content="View your batch's live location during your Hajj or Umrah journey." />
</svelte:head>

<section class="min-h-screen bg-gray-50 py-12">
	<div class="mx-auto max-w-2xl px-6">
		<!-- Header -->
		<div class="mb-8">
			<a 
				href="/hijrah-portal" 
				class="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
			>
				<Icon icon="mdi:arrow-left" class="h-4 w-4" />
				Back to Portal
			</a>
			<h1 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
				Batch Tracking
			</h1>
			<p class="mt-2 text-gray-600">
				View your group's live location and share it with your loved ones.
			</p>
		</div>

		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<Icon icon="mdi:loading" class="h-8 w-8 animate-spin text-gray-400" />
			</div>
		{:else if !authStore?.user}
			<div class="rounded-2xl border border-gray-200 bg-white p-8 text-center">
				<Icon icon="mdi:account-alert" class="mx-auto mb-4 h-12 w-12 text-gray-400" />
				<h3 class="text-lg font-semibold text-gray-900">Sign in Required</h3>
				<p class="mt-2 text-gray-500">Please sign in to view tracking information.</p>
				<a 
					href="/auth/login" 
					class="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
				>
					Sign In
				</a>
			</div>
		{:else if !trackingData?.hasBatch}
			<div class="rounded-2xl border border-gray-200 bg-white p-8 text-center">
				<Icon icon="mdi:map-marker-off" class="mx-auto mb-4 h-12 w-12 text-gray-400" />
				<h3 class="text-lg font-semibold text-gray-900">No Batch Assigned</h3>
				<p class="mt-2 text-gray-500">
					{trackingData?.message || 'You have not been assigned to a batch yet. Tracking will be available once your batch is assigned.'}
				</p>
			</div>
		{:else if !trackingData?.trackingCode}
			<div class="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
				<Icon icon="mdi:clock-alert" class="mx-auto mb-4 h-12 w-12 text-amber-400" />
				<h2 class="text-xl font-semibold text-amber-800">Tracking Not Started</h2>
				<p class="mt-2 text-amber-600">Your batch's tracking has not been activated by the guide yet.</p>
				<p class="mt-4 text-sm text-amber-500">Batch: {trackingData.batchName}</p>
			</div>
		{:else if !trackingData?.trackingActive}
			<div class="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
				<Icon icon="mdi:pause-circle" class="mx-auto mb-4 h-12 w-12 text-gray-400" />
				<h2 class="text-xl font-semibold text-gray-800">Sharing Paused</h2>
				<p class="mt-2 text-gray-600">Your batch's location sharing is currently paused by the guide.</p>
				<p class="mt-4 text-sm text-gray-500">Batch: {trackingData.batchName}</p>
			</div>
		{:else}
			<div class="space-y-6">
				<!-- Batch Info -->
				<div class="mb-4 text-center">
					<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800">
						<Icon icon="mdi:map-marker" class="h-4 w-4" />
						Live Batch Tracking
					</div>
					<h2 class="text-2xl font-bold text-gray-900">{trackingData.batchName}</h2>
					<p class="mt-1 text-sm text-gray-500">
						Tracking Code: <span class="font-mono font-semibold">{trackingData.trackingCode}</span>
					</p>
				</div>

				<!-- Activity Card -->
				<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-100 bg-gray-50 px-6 py-4">
						<h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500">Current Activity</h3>
					</div>
					<div class="p-6">
						<div class="flex items-center gap-4">
							{#if activityInfo}
								<div class="{activityInfo.color} flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
									<Icon icon={activityInfo.icon} class="h-8 w-8" />
								</div>
								<div>
									<p class="text-2xl font-semibold text-gray-900">{activityInfo.label}</p>
									{#if trackingData.lastUpdated}
										<p class="mt-1 text-sm text-gray-500">
											Updated {formatLastUpdated(trackingData.lastUpdated)}
										</p>
									{/if}
								</div>
							{:else}
								<div class="text-gray-400 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
									<Icon icon="mdi:map-marker-question" class="h-8 w-8" />
								</div>
								<div>
									<p class="text-2xl font-semibold text-gray-900">Activity not set</p>
									<p class="mt-1 text-sm text-gray-400">Waiting for guide update...</p>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Location Card -->
				{#if trackingData.latitude && trackingData.longitude}
					<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
						<div class="border-b border-gray-100 bg-gray-50 px-6 py-4">
							<h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500">Location</h3>
						</div>
						<div class="p-6">
							<div class="flex items-start gap-3">
								<Icon icon="mdi:map-marker" class="h-5 w-5 mt-0.5 shrink-0 text-emerald-500" />
								<div>
									{#if locationLoading}
										<p class="text-gray-500">Loading location...</p>
									{:else if locationName}
										<p class="text-gray-900 font-medium leading-relaxed">{locationName}</p>
									{:else}
										<p class="text-gray-600">Location available</p>
									{/if}
									<p class="mt-1 font-mono text-xs text-gray-400">
										{trackingData.latitude.toFixed(6)}, {trackingData.longitude.toFixed(6)}
									</p>
								</div>
							</div>
							<a 
								href="https://www.google.com/maps?q={trackingData.latitude},{trackingData.longitude}" 
								target="_blank"
								rel="noopener noreferrer"
								class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
							>
								<Icon icon="mdi:map" class="h-4 w-4" />
								View on Google Maps
								<Icon icon="mdi:open-in-new" class="h-3 w-3" />
							</a>
						</div>
					</div>
				{/if}

				<!-- Share Link -->
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Share with Family</h3>
					<p class="mb-4 text-sm text-gray-600">Share this link so your loved ones can track your journey:</p>
					<div class="flex gap-2">
						<button
							onclick={copyLink}
							class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
						>
							<Icon icon="mdi:content-copy" class="h-4 w-4" />
							Copy Link
						</button>
						<button
							onclick={shareLink}
							class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
						>
							<Icon icon="mdi:share-variant" class="h-4 w-4" />
							Share
						</button>
					</div>
				</div>

				<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-100 bg-gray-50 px-6 py-4">
						<h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500">Batch Common Location</h2>
					</div>
					<div class="p-6">
						<div class="flex items-center gap-4">
							<div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
								<Icon icon="ph:navigation-arrow" class="h-8 w-8" />
							</div>
							<a href="/hijrah-portal/pilgrim-information">
								<p class="text-2xl font-semibold text-gray-900">
									Go to Batch Common Location
								</p>
							</a>
						</div>
					</div>
				</div>

				<!-- Journey Photos Section -->
				{#if journeyImages.length > 0}
					<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
						<div class="border-b border-gray-100 bg-gray-50 px-6 py-4">
							<h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500">Journey Photos</h3>
						</div>
						<div class="p-6">
							<!-- Image Gallery -->
							<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
								{#each journeyImages as image (image.$id)}
									<div class="group relative aspect-square overflow-hidden rounded-lg">
										<img
											src={image.imageUrl}
											alt={image.caption || 'Journey photo'}
											class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
										/>
										<div class="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
											{#if image.caption}
												<p class="text-xs text-white truncate">{image.caption}</p>
											{/if}
											{#if image.activity}
												<span class="mt-1 inline-flex items-center gap-1 text-xs text-gray-200">
													<Icon icon={getActivityInfo(image.activity).icon} class="h-3 w-3" />
													{getActivityInfo(image.activity).label}
												</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- Status Bar -->
				<div class="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-600">
					<div class="flex items-center gap-2">
						<span class="relative flex h-2.5 w-2.5">
							<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
							<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
						</span>
						Live
					</div>
					<button 
						onclick={fetchTrackingData}
						class="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
					>
						<Icon icon="mdi:refresh" class="h-4 w-4" />
						Refresh
					</button>
				</div>
			</div>
		{/if}
	</div>
</section>
