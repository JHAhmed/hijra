<script>
	import TrackingControls from '$lib/components/TrackingControls.svelte';
	import { authStore } from '$lib/auth.svelte';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>Pilgrim Tracking | Hijrah Portal</title>
	<meta name="description" content="Share your live location with family during your Hajj or Umrah journey." />
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
				Pilgrim Tracking
			</h1>
			<p class="mt-2 text-gray-600">
				Share your live location and activity with your loved ones during your sacred journey.
			</p>
		</div>

		<!-- Info Banner -->
		<div class="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
			<div class="flex gap-3">
				<Icon icon="mdi:information" class="h-5 w-5 shrink-0 text-blue-600" />
				<div class="text-sm text-blue-800">
					<p class="font-medium">How it works</p>
					<ul class="mt-1 list-inside list-disc space-y-1 text-blue-700">
						<li>Your unique tracking code is created automatically</li>
						<li>Toggle sharing on to start broadcasting your location</li>
						<li>Share the link with family - they can view without signing in</li>
						<li>Select your current activity to let them know what you're doing</li>
						<li>Your location updates automatically when sharing is enabled</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Tracking Controls -->
		{#if authStore?.user}
			<TrackingControls pilgrimName={authStore.user.name || 'Pilgrim'} userId={authStore.user.$id} />
		{:else}
			<div class="rounded-2xl border border-gray-200 bg-white p-8 text-center">
				<Icon icon="mdi:account-alert" class="mx-auto mb-4 h-12 w-12 text-gray-400" />
				<h3 class="text-lg font-semibold text-gray-900">Sign in Required</h3>
				<p class="mt-2 text-gray-500">Please sign in to use the tracking feature.</p>
				<a 
					href="/auth/login" 
					class="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
				>
					Sign In
				</a>
			</div>
		{/if}

		<!-- Privacy Notice -->
		<div class="mt-8 rounded-xl border border-gray-200 bg-white p-4">
			<div class="flex gap-3">
				<Icon icon="mdi:shield-check" class="h-5 w-5 shrink-0 text-gray-400" />
				<div class="text-sm text-gray-600">
					<p class="font-medium text-gray-700">Your Privacy</p>
					<p class="mt-1">
						Your location is only shared when you choose to start sharing. Only people with your 
						unique tracking link can see your location. You can stop sharing at any time.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
