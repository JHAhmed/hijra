<script>
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import Button from '$components/ui/Button.svelte';
	import { authStore } from '$lib/auth.svelte';
	import { enhance } from '$app/forms';

	// Helper to format dates
	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};

	// Helper to format time
	const formatTime = (dateString) => {
		return new Date(dateString).toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	// Null-safe derived value
	const initials = $derived(
		authStore.user?.name
			? authStore.user.name
					.split(' ')
					.map((n) => n[0])
					.slice(0, 2)
					.join('')
					.toUpperCase()
			: '??'
	);

	async function handleLogout() {
		await authStore.logout();
		goto('/auth/');
	}
</script>

<svelte:head>
	<title>Profile & Settings | Hijrah Portal</title>
	<meta name="description" content="Manage your profile, settings, past journeys, and more." />
</svelte:head>

<div
	class="min-h-screen w-full bg-white pt-16 pb-20 text-secondary ">
	{#if authStore.isLoading}
		<!-- Loading state -->
		<div class="mx-auto max-w-md py-20 text-center">
			<Icon icon="heroicons:arrow-path" class="mx-auto mb-6 h-12 w-12 animate-spin text-gray-300" />
			<h2 class="mb-4 text-2xl font-bold tracking-tight text-secondary">Loading Profile</h2>
			<p class="text-gray-500">Please wait while we fetch your information...</p>
		</div>
	{:else if authStore.isAuthenticated}
		<div class="mx-auto max-w-6xl px-6 py-12 md:px-12 md:py-16">
			<div
				class="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
				<div>
					<span class="mb-3 block text-xs font-bold tracking-widest text-primary uppercase">
						My Account
					</span>
					<h1 class="text-3xl font-medium tracking-tighter text-secondary md:text-4xl">
						Profile & Settings
					</h1>
				</div>

				<form method="POST" action="?/logout" use:enhance>
					<Button
						type="submit"
						variant="secondary"
						text="Sign Out"
						class="border-red-100 text-red-600 shadow-red-500 hover:border-red-200 hover:bg-red-50" />
				</form>
			</div>

			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div class="lg:col-span-1">
					<div
						class="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/40 md:p-8">
						<div class="flex flex-col items-center text-center">
							<div
								class="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary shadow-lg ring-4 ring-white">
								{initials}
								{#if authStore.user.emailVerification}
									<div class="absolute right-0 bottom-0 rounded-full bg-white p-1 shadow-sm">
										<Icon icon="heroicons:check-badge-solid" class="h-6 w-6 text-blue-500" />
									</div>
								{/if}
							</div>

							<h2 class="text-xl font-bold tracking-tight text-secondary">{authStore.user.name}</h2>
							<p class="mb-6 text-sm text-gray-500">{authStore.user.email}</p>

							<div class="mb-8 flex flex-wrap justify-center gap-2">
								<span
									class={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
										authStore.user.emailVerification
											? 'border-blue-100 bg-blue-50 text-blue-700'
											: 'border-yellow-100 bg-yellow-50 text-yellow-700'
									}`}>
									<Icon
										icon={authStore.user.emailVerification
											? 'heroicons:check-circle-solid'
											: 'heroicons:exclamation-circle-solid'}
										class="h-3.5 w-3.5" />
									{authStore.user.emailVerification ? 'Verified Email' : 'Email Unverified'}
								</span>

								<span
									class={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
										authStore.user.status
											? 'border-green-100 bg-green-50 text-green-700'
											: 'border-red-100 bg-red-50 text-red-700'
									}`}>
									<Icon icon="heroicons:user-solid" class="h-3.5 w-3.5" />
									{authStore.user.status ? 'Active Account' : 'Inactive'}
								</span>
							</div>

							<Button variant="secondary" text="Edit Profile" fullWidth={true} class="mb-3" />
						</div>
					</div>

					<div class="mt-6 rounded-3xl border border-gray-200 bg-gray-50 p-6">
						<h3 class="mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Security</h3>

						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400">
										<Icon icon="heroicons:shield-check" class="h-4 w-4" />
									</div>
									<span class="text-sm font-medium text-secondary">MFA Status</span>
								</div>
								<span
									class={`text-xs font-bold ${authStore.user.mfa ? 'text-green-600' : 'text-gray-400'}`}>
									{authStore.user.mfa ? 'ENABLED' : 'DISABLED'}
								</span>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400">
										<Icon icon="heroicons:key" class="h-4 w-4" />
									</div>
									<span class="text-sm font-medium text-secondary">Password</span>
								</div>
								<button class="text-xs font-bold text-primary hover:underline">Update</button>
							</div>
						</div>
					</div>
				</div>

				<div class="space-y-8 lg:col-span-2">
					<div class="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
						<div class="mb-6 flex items-center justify-between">
							<h3 class="text-lg font-bold tracking-tight text-secondary">Personal Information</h3>
							{#if !authStore.user.phone}
								<span
									class="hidden rounded-md bg-red-50 px-2 py-1 text-xs text-red-500 sm:inline-block">
									Action required
								</span>
							{/if}
						</div>

						<div class="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
							<div class="group border-b border-gray-100 pb-2">
								<span class="mb-1 block text-xs font-medium text-gray-400">Full Name</span>
								<span class="block text-base font-medium text-secondary"
									>{authStore.user.name}</span>
							</div>

							<div class="group border-b border-gray-100 pb-2">
								<span class="mb-1 block text-xs font-medium text-gray-400">Email Address</span>
								<div class="flex items-center justify-between">
									<span class="block text-base font-medium text-secondary"
										>{authStore.user.email}</span>
									{#if !authStore.user.emailVerification}
										<button class="text-xs font-bold text-primary hover:underline">Verify</button>
									{/if}
								</div>
							</div>

							<div class="group border-b border-gray-100 pb-2">
								<span class="mb-1 block text-xs font-medium text-gray-400">Phone Number</span>
								{#if authStore.user.phone}
									<span class="block text-base font-medium text-secondary"
										>{authStore.user.phone}</span>
								{:else}
									<button
										class="flex items-center gap-1 text-base font-medium text-gray-300 transition-colors hover:text-primary">
										<Icon icon="heroicons:plus-circle" class="h-4 w-4" />
										<span>Add Phone Number</span>
									</button>
								{/if}
							</div>

							<div class="group border-b border-gray-100 pb-2">
								<span class="mb-1 block text-xs font-medium text-gray-400">Account ID</span>
								<div class="flex items-center gap-2">
									<span class="block font-mono text-base text-gray-500">{authStore.user.$id}</span>
									<button class="text-gray-300 hover:text-secondary" title="Copy ID">
										<Icon icon="heroicons:document-duplicate" class="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>
					</div>

					<div class="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
						<h3 class="mb-6 text-lg font-bold tracking-tight text-secondary">Account Activity</h3>

						<div class="space-y-6">
							<div class="flex items-start gap-4">
								<div
									class="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
									<Icon icon="heroicons:clock" class="h-5 w-5" />
								</div>
								<div>
									<p class="font-medium text-secondary">Last Accessed</p>
									<p class="text-sm text-gray-500">
										You are currently logged in. Last active at
										<span class="font-medium text-gray-700"
											>{formatTime(authStore.user.accessedAt)}</span>
										on
										<span class="font-medium text-gray-700"
											>{formatDate(authStore.user.accessedAt)}</span
										>.
									</p>
								</div>
							</div>

							<div class="flex items-start gap-4">
								<div
									class="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
									<Icon icon="heroicons:calendar-days" class="h-5 w-5" />
								</div>
								<div>
									<p class="font-medium text-secondary">Member Since</p>
									<p class="text-sm text-gray-500">
										Account created on <span class="font-medium text-gray-700"
											>{formatDate(authStore.user.registration)}</span
										>.
									</p>
								</div>
							</div>
						</div>
					</div>

					<div
						class="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-300 shadow-sm">
							<Icon icon="ph:airplane-tilt" class="h-6 w-6" />
						</div>
						<h3 class="text-sm font-bold text-gray-400">Booked Journeys</h3>
						<p class="mt-1 text-sm text-gray-400">
							Your upcoming Hajj or Umrah details will appear here.
						</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="mx-auto max-w-md py-20 text-center">
			<Icon icon="heroicons:lock-closed-solid" class="mx-auto mb-6 h-12 w-12 text-gray-300" />
			<h2 class="mb-4 text-2xl font-bold tracking-tight text-secondary">Access Denied</h2>
			<p class="mb-8 text-gray-500">
				You must be logged in to view your profile. Please sign in to continue.
			</p>
			<Button href="/auth/" text="Go to Login" />
		</div>
	{/if}
</div>
