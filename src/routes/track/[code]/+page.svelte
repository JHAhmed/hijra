<script>
	import { onMount, onDestroy } from 'svelte';
	import Icon from '@iconify/svelte';
	import { Button } from '$components';

	let { data } = $props();

	let trackingData = $state(data);
	let refreshInterval;
	let lastRefresh = $state(new Date());

	const activities = {
		tawaf: { icon: 'mdi:rotate-360', label: 'Performing Tawaf', color: 'text-emerald-600' },
		sai: { icon: 'mdi:walk', label: 'Performing Sa\'i', color: 'text-blue-600' },
		mina: { icon: 'mdi:tent', label: 'At Mina', color: 'text-amber-600' },
		arafat: { icon: 'mdi:weather-sunny', label: 'At Arafat', color: 'text-orange-600' },
		muzdalifah: { icon: 'mdi:weather-night', label: 'At Muzdalifah', color: 'text-indigo-600' },
		jamarat: { icon: 'mdi:target', label: 'At Jamarat', color: 'text-red-600' },
		resting: { icon: 'mdi:bed', label: 'Resting', color: 'text-gray-600' },
		traveling: { icon: 'mdi:bus', label: 'Traveling', color: 'text-purple-600' }
	};

	function getActivityInfo(activity) {
		if (!activity) return { icon: 'mdi:map-marker-question', label: 'Activity not set', color: 'text-gray-400' };
		return activities[activity.toLowerCase()] || { icon: 'mdi:map-marker', label: activity, color: 'text-gray-600' };
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

	async function refreshData() {
		try {
			const response = await fetch(`/api/tracking/${data.code}`);
			const newData = await response.json();
			if (response.ok) {
				trackingData = { ...newData, code: data.code };
				lastRefresh = new Date();
			}
		} catch (error) {
			console.error('Failed to refresh tracking data:', error);
		}
	}

	onMount(() => {
		// Auto-refresh every 30 seconds
		refreshInterval = setInterval(refreshData, 30000);
	});

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});

	const activityInfo = $derived(getActivityInfo(trackingData.currentActivity));
</script>

<svelte:head>
	<title>{trackingData.pilgrimName ? `Tracking ${trackingData.pilgrimName}` : 'Pilgrim Tracking'} | Hijrah</title>
	<meta name="description" content="Live tracking for Hajj/Umrah pilgrim" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
	<div class="mx-auto mt-12 max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8 text-center">
			<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800">
				<Icon icon="mdi:map-marker" class="h-4 w-4" />
				Live Pilgrim Tracking
			</div>
			<h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
				{trackingData.pilgrimName || 'Pilgrim'}
			</h1>
			<p class="mt-2 text-sm text-gray-500">
				Tracking Code: <span class="font-mono font-semibold">{data.code}</span>
			</p>
		</div>

		<!-- Error State -->
		{#if trackingData.error}
			<div class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
				<Icon icon="mdi:alert-circle" class="mx-auto mb-4 h-12 w-12 text-red-400" />
				<h2 class="text-xl font-semibold text-red-800">Unable to Load</h2>
				<p class="mt-2 text-red-600">{trackingData.error}</p>
				<Button onclick={refreshData} text="Try Again" variant="secondary" class="mt-4" />
			</div>

		<!-- Expired State -->
		{:else if trackingData.expired}
			<div class="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
				<Icon icon="mdi:clock-alert" class="mx-auto mb-4 h-12 w-12 text-amber-400" />
				<h2 class="text-xl font-semibold text-amber-800">Link Expired</h2>
				<p class="mt-2 text-amber-600">This tracking link has expired and is no longer active.</p>
			</div>

		<!-- Inactive State -->
		{:else if trackingData.inactive}
			<div class="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
				<Icon icon="mdi:pause-circle" class="mx-auto mb-4 h-12 w-12 text-gray-400" />
				<h2 class="text-xl font-semibold text-gray-800">Sharing Paused</h2>
				<p class="mt-2 text-gray-600">{trackingData.pilgrimName} has paused location sharing.</p>
			</div>

		<!-- Active Tracking -->
		{:else}
			<div class="space-y-6">
				<!-- Activity Card -->
				<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-100 bg-gray-50 px-6 py-4">
						<h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500">Current Activity</h2>
					</div>
					<div class="p-6">
						<div class="flex items-center gap-4">
							<div class="{activityInfo.color} flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
								<Icon icon={activityInfo.icon} class="h-8 w-8" />
							</div>
							<div>
								<p class="text-2xl font-semibold text-gray-900">{activityInfo.label}</p>
								{#if trackingData.lastUpdated}
									<p class="mt-1 text-sm text-gray-500">
										Updated {formatLastUpdated(trackingData.lastUpdated)}
									</p>
								{:else}
									<p class="mt-1 text-sm text-gray-400">Waiting for first update...</p>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<!-- Location Card -->
				{#if trackingData.latitude && trackingData.longitude}
					<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
						<div class="border-b border-gray-100 bg-gray-50 px-6 py-4">
							<h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500">Location</h2>
						</div>
						<div class="p-6">
							<div class="flex items-center gap-3">
								<Icon icon="mdi:crosshairs-gps" class="h-5 w-5 text-gray-400" />
								<p class="font-mono text-sm text-gray-600">
									{trackingData.latitude.toFixed(6)}, {trackingData.longitude.toFixed(6)}
								</p>
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
						onclick={refreshData}
						class="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
					>
						<Icon icon="mdi:refresh" class="h-4 w-4" />
						Refresh
					</button>
				</div>
			</div>
		{/if}

		<!-- Footer -->
		<div class="mt-12 text-center">
			<p class="text-xs text-gray-400">
				Powered by <a href="/" class="font-medium text-gray-500 hover:text-gray-700">Hijrah Portal</a>
			</p>
		</div>
	</div>
</main>
