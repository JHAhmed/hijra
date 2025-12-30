<script>
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/auth.svelte';

	let isLoading = $state(true);
	let batch = $state(null);
	let applicationId = $state(null);

	// Default fallback data
	const defaultLocation = {
		name: 'Meeting Point TBA',
		address: 'Address will be provided soon',
		description: 'Come here if you are lost or need immediate assistance.',
		lat: 21.4225,
		lng: 39.8262,
		image:
			'https://images.unsplash.com/photo-1619468129361-605ebea04b44?q=80&w=1171&auto=format&fit=crop'
	};

	const defaultLeader = {
		name: 'Guide Not Assigned',
		role: 'Batch Guide',
		phone: 'TBA'
	};

	// Derived values from batch or defaults
	const adminLocation = $derived(batch?.meetingPoint ? {
		name: batch.meetingPoint,
		address: batch.meetingPointAddress || 'Address will be provided',
		description: 'Come here if you are lost or need immediate assistance.',
		lat: 21.4225,
		lng: 39.8262,
		image: 'https://images.unsplash.com/photo-1619468129361-605ebea04b44?q=80&w=1171&auto=format&fit=crop'
	} : defaultLocation);

	const groupLeader = $derived(batch?.guideName ? {
		name: batch.guideName,
		role: `Guide • ${batch.name || 'Batch'}`,
		phone: batch.guidePhone || 'Not available'
	} : defaultLeader);

	async function fetchBatchInfo() {
		if (!authStore?.user) {
			isLoading = false;
			return;
		}

		try {
			// First get user's application
			const progressRes = await fetch(`/api/user/progress?userId=${authStore.user.$id}`);
			const progressData = await progressRes.json();

			if (progressData.success && progressData.applicationId) {
				applicationId = progressData.applicationId;

				// Fetch batch info
				const batchRes = await fetch(`/api/batches?applicationId=${applicationId}`);
				const batchData = await batchRes.json();

				if (batchData.success && batchData.batch) {
					batch = batchData.batch;
				}
			}
		} catch (error) {
			console.error('Failed to fetch batch info:', error);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		fetchBatchInfo();
	});
</script>

<svelte:head>
	<title>Pilgrim Information | Hijrah Portal</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 pb-20">
	<!-- Header -->
	<header class="border-b border-gray-100 bg-white">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<nav class="mb-4 flex items-center gap-2 text-sm text-gray-500">
				<a href="/hijrah-portal" class="transition-colors hover:text-primary">Portal</a>
				<Icon icon="ph:caret-right" class="h-4 w-4" />
				<span class="font-medium text-gray-900">Pilgrim Information</span>
			</nav>
			<h1 class="text-3xl font-medium tracking-tight text-secondary md:text-4xl">
				Pilgrim Information
			</h1>
			<p class="mt-2 max-w-2xl text-gray-500">
				Your essential travel details, contacts, and emergency points at a glance.
			</p>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" in:fade={{ duration: 400 }}>
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- Current Admin Location (Prominent Card) -->
			<div
				class="group relative overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md lg:col-span-2"
			>
				<div class="relative h-64 w-full overflow-hidden bg-gray-100 sm:h-80">
					<img
						src={adminLocation.image}
						alt="Location Map View"
						class="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
					</div>
					<div class="absolute bottom-6 left-6 right-6 text-white md:bottom-8 md:left-8">
						<div class="mb-2 flex items-center gap-2">
							<span
								class="rounded-full bg-red-600/90 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-md"
							>
								Emergency Meeting Point
							</span>
						</div>
						<h2 class="text-2xl font-medium tracking-tight md:text-3xl">{adminLocation.name}</h2>
						<p class="mt-1 text-gray-200">{adminLocation.description}</p>
					</div>
				</div>

				<div class="flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center md:p-8">
					<div class="space-y-1">
						<p class="text-xs font-bold tracking-widest text-gray-400 uppercase">Address</p>
						<p class="text-lg leading-snug text-secondary md:text-xl">
							{adminLocation.address}
						</p>
					</div>
					<a
						href="https://maps.google.com/?q={adminLocation.lat},{adminLocation.lng}"
						target="_blank"
						class="flex shrink-0 items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 font-medium text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
					>
						<Icon icon="ph:navigation-arrow-fill" class="h-5 w-5" />
						<span>Navigate Here</span>
					</a>
				</div>
			</div>

			<!-- Group Leader Card -->
			<div
				class="flex flex-col justify-center rounded-4xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md"
			>
				<div class="flex items-center gap-4">
					<!-- <img
						src={groupLeader.image}
						alt={groupLeader.name}
						class="h-16 w-16 rounded-full object-cover ring-4 ring-gray-50"
					/> -->
					<div>
						<h3 class="text-lg font-semibold text-secondary">{groupLeader.name}</h3>
						<p class="text-sm text-gray-500">Batch Admin</p>
					</div>
				</div>

				<div class="mt-6 border-t border-gray-100 pt-6">
					<p class="text-xs font-bold tracking-widest text-gray-400 uppercase">Emergency Contact</p>
					<a
						href="tel:{groupLeader.phone}"
						class="mt-2 flex items-center gap-2.5 text-xl font-medium text-secondary transition-colors hover:text-primary"
					>
						<Icon icon="ph:phone-fill" class="h-5 w-5" />
						{groupLeader.phone}
					</a>
				</div>
			</div>

			<!-- Accommodation Card -->
			<!-- <div
				class="rounded-4xl hidden border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md lg:col-span-1"
			>
				<div class="mb-6 flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"
					>
						<Icon icon="ph:buildings-fill" class="h-5 w-5" />
					</div>
					<div>
						<h3 class="text-lg font-semibold text-secondary">Accommodation</h3>
						<p class="text-xs text-gray-500">Your hotel details</p>
					</div>
				</div>

				<div class="space-y-6">
					<div class="relative pl-6">
						<div class="absolute top-2 bottom-0 left-2 w-0.5 bg-gray-100"></div>
						<div
							class="absolute top-2 left-[5px] h-1.5 w-1.5 rounded-full bg-emerald-500 ring-4 ring-white"
						></div>
						<div class="mb-1 text-xs font-bold tracking-wider text-emerald-600 uppercase">
							Current Stay
						</div>
						<h4 class="text-base font-medium text-secondary">{accommodation.makkah.name}</h4>
						<p class="text-sm text-gray-500">Room {accommodation.makkah.room}</p>
						<p class="mt-1 text-xs text-gray-400">{accommodation.makkah.dates}</p>
					</div>

					<div class="relative pl-6">
						<div
							class="absolute top-2 left-[5px] h-1.5 w-1.5 rounded-full bg-gray-300 ring-4 ring-white"
						></div>
						<div class="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
							Next Stay
						</div>
						<h4 class="text-base font-medium text-secondary">{accommodation.madinah.name}</h4>
						<p class="text-sm text-gray-500">Room {accommodation.madinah.room}</p>
						<p class="mt-1 text-xs text-gray-400">{accommodation.madinah.dates}</p>
					</div>
				</div>
                
                 <button class="mt-6 w-full text-center text-xs font-medium text-primary hover:underline">View Hotel Directions</button>
			</div> -->

            <!-- Digital ID Card (Bonus) -->
			<div
				class="hidden rounded-4xl border border-gray-100 bg-gradient-to-br from-secondary to-gray-800 p-8 text-white shadow-sm transition-all duration-300 hover:shadow-md lg:col-span-2"
			>
                <div class="flex items-start justify-between">
                    <div>
                         <p class="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Digital ID</p>
                         <h3 class="text-2xl font-medium tracking-tight">Jamal Ahmed</h3>
                         <p class="text-sm text-gray-400">Passport: A12345678</p>
                    </div>
                    <Icon icon="ph:qr-code" class="w-12 h-12 text-white/20" />
                </div>
                <div class="mt-8 flex gap-4">
                    <div class="flex-1 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                        <p class="text-[10px] text-gray-400 uppercase">Visa Number</p>
                        <p class="font-mono text-sm">305928103</p>
                    </div>
                     <div class="flex-1 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                        <p class="text-[10px] text-gray-400 uppercase">Group</p>
                        <p class="font-mono text-sm">HJ-26</p>
                    </div>
                     <div class="flex-1 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                        <p class="text-[10px] text-gray-400 uppercase">Blood Type</p>
                        <p class="font-mono text-sm">O+</p>
                    </div>
                </div>
            </div>
		</div>
	</main>
</div>
