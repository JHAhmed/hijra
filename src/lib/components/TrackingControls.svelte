<script>
	import { onMount, onDestroy } from 'svelte';
	import Icon from '@iconify/svelte';
	import { Button } from '$components';
	import { toast } from 'svelte-sonner';

	let { pilgrimName = 'Pilgrim', userId = '' } = $props();

	let isSharing = $state(false);
	let trackingCode = $state(null);
	let currentActivity = $state('');
	let isLoading = $state(true);
	let watchId = $state(null);
	let lastLocation = $state(null);
	let locationUpdateInterval = $state(null);

	const umrahStages = [
		{ value: 'ihram', label: 'Ihram', icon: 'mdi:account-circle', description: 'State of consecration' },
		{ value: 'tawaf', label: 'Tawaf', icon: 'mdi:rotate-360', description: 'Circling the Kaaba' },
		{ value: 'sai', label: "Sa'i", icon: 'mdi:walk', description: 'Walking between hills' },
		{ value: 'halq', label: 'Halq/Taqsir', icon: 'mdi:content-cut', description: 'Hair cutting ritual' }
	];

	// Initialize - get or create tracking session for this user
	async function initializeTracking() {
		if (!userId) {
			isLoading = false;
			return;
		}

		try {
			// First check if session exists
			const checkResponse = await fetch(`/api/tracking?userId=${userId}`);
			const checkData = await checkResponse.json();

			if (checkData.success && checkData.session) {
				// Session exists
				trackingCode = checkData.session.trackingCode;
				isSharing = checkData.session.isActive;
				currentActivity = checkData.session.currentActivity || '';
				
				if (isSharing) {
					startLocationWatch();
				}
			} else {
				// Create new session
				const createResponse = await fetch('/api/tracking', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ pilgrimName, userId })
				});

				const createData = await createResponse.json();

				console.log(createData)

				if (createData.success) {
					trackingCode = createData.trackingCode;
					isSharing = false; // Start inactive, user needs to enable
				}
			}
		} catch (error) {
			console.error('Failed to initialize tracking:', error);
			toast.error('Failed to initialize tracking');
		} finally {
			isLoading = false;
		}
	}

	async function toggleSharing() {
		if (!trackingCode) return;

		const newState = !isSharing;

		try {
			const response = await fetch(`/api/tracking/${trackingCode}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ isActive: newState })
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
		} catch (error) {
			toast.error(error.message);
		}
	}

	function startLocationWatch() {
		if (!navigator.geolocation) {
			toast.error('Geolocation is not supported by your browser');
			return;
		}

		// Request permission and start watching
		watchId = navigator.geolocation.watchPosition(
			async (position) => {
				lastLocation = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				};
				await updateTracking();
			},
			(error) => {
				console.error('Geolocation error:', error);
				if (error.code === error.PERMISSION_DENIED) {
					toast.error('Location permission denied. Please enable it in your browser settings.');
				}
			},
			{
				enableHighAccuracy: true,
				maximumAge: 30000,
				timeout: 10000
			}
		);

		// Also set up periodic updates (every 30 seconds) as backup
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

			await fetch(`/api/tracking/${trackingCode}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
		} catch (error) {
			console.error('Failed to update tracking:', error);
		}
	}

	async function handleActivityToggle(stageValue) {
		// Toggle off if already selected, otherwise select new stage
		currentActivity = currentActivity === stageValue ? '' : stageValue;
		if (isSharing) {
			await updateTracking();
			if (currentActivity) {
				const stage = umrahStages.find(s => s.value === currentActivity);
				toast.success(`Now at: ${stage?.label}`);
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

	function shareLink() {
		const url = `${window.location.origin}/track/${trackingCode}`;
		if (navigator.share) {
			navigator.share({
				title: `Track ${pilgrimName}'s Journey`,
				text: `Follow my Hajj/Umrah journey in real-time`,
				url
			});
		} else {
			copyLink();
		}
	}

	onMount(() => {
		initializeTracking();
	});

	onDestroy(() => {
		stopLocationWatch();
	});
</script>

<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
	<div class="mb-4 flex items-center gap-3">
		<div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
			<Icon icon="mdi:map-marker-radius" class="h-5 w-5 text-emerald-600" />
		</div>
		<div>
			<h3 class="text-lg font-semibold text-gray-900">Live Location Sharing</h3>
			<p class="text-sm text-gray-500">Let family track your journey</p>
		</div>
	</div>

	{#if isLoading}
		<!-- Loading State -->
		<div class="flex items-center justify-center py-8">
			<Icon icon="mdi:loading" class="h-8 w-8 animate-spin text-gray-400" />
		</div>
	{:else if !trackingCode}
		<!-- Error State -->
		<div class="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
			Failed to initialize tracking. Please refresh the page.
		</div>
	{:else}
		<div class="space-y-4">
			<!-- Tracking Code Display -->
			<div class="rounded-xl {isSharing ? 'bg-emerald-50' : 'bg-gray-100'} p-4">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm font-medium {isSharing ? 'text-emerald-800' : 'text-gray-600'}">
						Your Tracking Code
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
							{isSharing ? 'Your location is being shared' : 'Toggle to start sharing'}
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

			<!-- Umrah Stage Toggles -->
			<div>
				<p class="mb-3 text-sm font-medium text-gray-700">Current Stage</p>
				<div class="grid grid-cols-2 gap-3">
					{#each umrahStages as stage}
						<button
							onclick={() => handleActivityToggle(stage.value)}
							class="flex items-center gap-3 rounded-xl border-2 p-3 transition-all
								{currentActivity === stage.value 
									? 'border-emerald-500 bg-emerald-50 shadow-sm' 
									: 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}"
						>
							<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
								{currentActivity === stage.value ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}">
								<Icon icon={stage.icon} class="h-5 w-5" />
							</div>
							<div class="text-left">
								<p class="text-sm font-semibold {currentActivity === stage.value ? 'text-emerald-900' : 'text-gray-900'}">
									{stage.label}
								</p>
								<p class="text-xs {currentActivity === stage.value ? 'text-emerald-600' : 'text-gray-500'}">
									{stage.description}
								</p>
							</div>
							{#if currentActivity === stage.value}
								<div class="ml-auto">
									<Icon icon="mdi:check-circle" class="h-5 w-5 text-emerald-500" />
								</div>
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
