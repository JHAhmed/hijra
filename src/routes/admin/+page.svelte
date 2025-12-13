<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Toaster } from 'svelte-sonner';
	import Icon from '@iconify/svelte';
	import Modal from '$components/ui/Modal.svelte';
	import Button from '$components/ui/Button.svelte';

	let isLoading = $state(true);

	let stats = $state({
		total: { value: 0, label: 'Active', sub: 'Registered pilgrims' },
		interested: { value: 0, label: 'Pending', sub: 'Awaiting review' },
		shortlisted: { value: 0, label: 'In Review', sub: 'Documents submitted' },
		approved: { value: 0, label: 'Approved', sub: 'Visa Processed' }
	});

	let recentActivity = $state([]);

	let packageCapacity = $state([
		{ name: 'Premium Hajj 2026', current: 45, max: 100, color: 'bg-emerald-500' },
		{ name: 'Ramadan Umrah', current: 82, max: 90, color: 'bg-blue-500' },
		{ name: 'Luxury Shifting', current: 12, max: 50, color: 'bg-purple-500' }
	]);

	/**
	 * Map application status to user-friendly action text
	 */
	function getActionFromStatus(status) {
		const statusMap = {
			package_selected: 'Selected Package',
			details_submitted: 'Submitted Details',
			docs_review: 'Uploaded Documents',
			pending_payment: 'Awaiting Payment',
			payment_completed: 'Payment Completed',
			visa_processing: 'Visa Processing',
			visa_approved: 'Visa Approved',
			completed: 'Journey Completed'
		};
		return statusMap[status] || 'Application Updated';
	}

	/**
	 * Format relative time from date
	 */
	function getRelativeTime(dateString) {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 1) return 'now';
		if (diffMins < 60) return `${diffMins}m`;
		if (diffHours < 24) return `${diffHours}h`;
		if (diffDays < 7) return `${diffDays}d`;
		return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
	}

	/**
	 * Fetch recent applications for the dashboard
	 */
	async function fetchRecentApplications() {
		try {
			const response = await fetch('/api/admin/applications?recent=true');
			const result = await response.json();

			if (result.success && result.applications) {
				recentActivity = result.applications.map((app) => ({
					id: app.$id,
					name: app.leadPilgrim
						? `${app.leadPilgrim.firstName} ${app.leadPilgrim.lastName}`
						: 'Unknown Pilgrim',
					action: getActionFromStatus(app.status),
					time: getRelativeTime(app.$updatedAt || app.$createdAt),
					type: app.packageId?.includes('hajj') ? 'hajj' : 'umrah',
					status: app.status
				}));

				// Update stats based on fetched data
				stats.total.value = result.total || recentActivity.length;
			}
		} catch (error) {
			console.error('Failed to fetch recent applications:', error);
		}
	}

	/**
	 * Fetch dashboard stats
	 */
	async function fetchStats() {
		try {
			// Fetch all applications to calculate stats
			const response = await fetch('/api/admin/applications?limit=100');
			const result = await response.json();

			if (result.success && result.applications) {
				const apps = result.applications;
				stats.total.value = result.total || apps.length;

				// Count by status
				stats.interested.value = apps.filter(
					(a) => a.status === 'package_selected' || a.status === 'details_submitted'
				).length;
				stats.shortlisted.value = apps.filter(
					(a) => a.status === 'docs_review' || a.status === 'pending_payment'
				).length;
				stats.approved.value = apps.filter(
					(a) => a.status === 'visa_approved' || a.status === 'completed'
				).length;
			}
		} catch (error) {
			console.error('Failed to fetch stats:', error);
		}
	}

	onMount(async () => {
		await Promise.all([fetchRecentApplications(), fetchStats()]);
		isLoading = false;
	});

	const todayDate = new Date().toLocaleDateString('en-GB', {
		weekday: 'long',
		day: 'numeric',
		month: 'long'
	});

	function getInitials(name) {
		return name
			.split(' ')
			.map((n) => n[0])
			.slice(0, 2)
			.join('');
	}
</script>

<Toaster position="bottom-right" />

{#if isLoading}
	<Modal text="Syncing Dashboard..." />
{:else}
	<div class="mx-auto w-full max-w-10xl space-y-8 p-6 md:p-10" in:fade={{ duration: 500 }}>
		<div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
			<div class="space-y-1">
				<span class="text-xs font-bold tracking-widest text-gray-400 uppercase">
					{todayDate}
				</span>
				<h1 class="text-3xl font-medium tracking-tighter text-secondary md:text-4xl">Overview</h1>
			</div>

			<div class="flex items-center gap-3">
				<Button variant="secondary" text="Export" size="sm" class="group" />

				<Button variant="primary" text="New Pilgrim" size="sm" class="group" />
			</div>
		</div>

		<div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-6">
				<div
					class="group relative flex cursor-pointer flex-col justify-between rounded-4xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:border-gray-300 hover:shadow-md">
					<div class="flex items-start justify-between">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-secondary">
							<Icon icon="heroicons:users" class="h-5 w-5" />
						</div>
						<span
							class="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
							<Icon icon="heroicons:arrow-trending-up" class="h-3 w-3" /> 12%
						</span>
					</div>
					<div class="mt-6">
						<h3 class="text-4xl font-medium tracking-tighter text-secondary">
							{stats.total.value.toLocaleString()}
						</h3>
						<p class="mt-1 text-sm font-medium text-secondary">{stats.total.label}</p>
						<p class="text-xs text-gray-400">{stats.total.sub}</p>
					</div>
				</div>

				<div
					class="group relative flex cursor-pointer flex-col justify-between rounded-4xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:border-gray-300 hover:shadow-md">
					<div class="flex items-start justify-between">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
							<Icon icon="heroicons:user-plus" class="h-5 w-5" />
						</div>
					</div>
					<div class="mt-6">
						<h3 class="text-4xl font-medium tracking-tighter text-secondary">
							{stats.interested.value}
						</h3>
						<p class="mt-1 text-sm font-medium text-secondary">{stats.interested.label}</p>
						<p class="text-xs text-gray-400">{stats.interested.sub}</p>
					</div>
				</div>

				<div
					class="group relative flex cursor-pointer flex-col justify-between rounded-4xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-md">
					<div class="flex items-start justify-between">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
							<Icon icon="heroicons:star" class="h-5 w-5" />
						</div>
					</div>
					<div class="mt-6">
						<h3 class="text-4xl font-medium tracking-tighter text-secondary">
							{stats.shortlisted.value}
						</h3>
						<p class="mt-1 text-sm font-medium text-secondary">{stats.shortlisted.label}</p>
						<p class="text-xs text-gray-400">{stats.shortlisted.sub}</p>
					</div>
				</div>

				<div
					class="group relative flex cursor-pointer flex-col justify-between rounded-4xl border border-gray-900 bg-secondary p-8 text-white transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20">
					<div class="flex items-start justify-between">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-emerald-400 backdrop-blur-sm">
							<Icon icon="heroicons:check-badge" class="h-5 w-5" />
						</div>
					</div>
					<div class="mt-6">
						<h3 class="text-4xl font-medium tracking-tighter text-white">{stats.approved.value}</h3>
						<p class="mt-1 text-sm font-medium text-white">{stats.approved.label}</p>
						<p class="text-xs text-gray-400">{stats.approved.sub}</p>
					</div>
				</div>

				<div
					class="flex flex-col justify-center rounded-4xl border border-gray-100 bg-white p-8 sm:col-span-2">
					<div class="mb-8 flex items-end justify-between">
						<div>
							<h3 class="text-xl font-medium tracking-tight text-secondary">Package Capacity</h3>
							<p class="mt-1 text-sm text-gray-500">Real-time slot availability.</p>
						</div>
						<div class="hidden h-px w-24 bg-gray-100 sm:block"></div>
					</div>

					<div class="space-y-8">
						{#each packageCapacity as pkg}
							<div class="group cursor-default">
								<div class="mb-3 flex items-center justify-between text-sm">
									<div class="flex items-center gap-3">
										<span class="font-medium text-secondary">{pkg.name}</span>
										<span
											class="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
											{pkg.max} Slots Total
										</span>
									</div>
									<span class="font-medium text-gray-900">{pkg.current} / {pkg.max}</span>
								</div>

								<div class="relative h-2 w-full overflow-hidden rounded-full bg-gray-50">
									<div
										class="absolute top-0 left-0 h-full rounded-full {pkg.color} transition-all duration-1000 ease-out group-hover:brightness-110"
										style="width: {(pkg.current / pkg.max) * 100}%">
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div
				class="flex h-fit flex-col rounded-4xl border border-gray-100 bg-white p-8 lg:col-span-1">
				<div class="mb-8 flex items-center justify-between">
					<h3 class="text-lg font-medium tracking-tight text-secondary">Live Activity</h3>
					<a
						href="/admin/users"
						class="text-[11px] font-bold tracking-widest text-primary uppercase hover:underline"
						>View All</a>
				</div>

				<div
					class="flex-1 space-y-6 overflow-y-auto pr-2 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
					{#if recentActivity.length === 0}
						<div class="flex flex-col items-center justify-center py-8 text-center">
							<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
								<Icon icon="heroicons:inbox" class="h-6 w-6 text-gray-300" />
							</div>
							<p class="text-sm text-gray-400">No recent activity</p>
							<p class="text-xs text-gray-300">New applications will appear here</p>
						</div>
					{:else}
						{#each recentActivity as activity}
							<div class="group flex cursor-pointer gap-4 transition-opacity hover:opacity-100">
								<div class="relative mt-1">
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-[10px] font-bold text-secondary ring-1 ring-gray-100 transition-all duration-300 group-hover:bg-secondary group-hover:text-white group-hover:shadow-md">
										{getInitials(activity.name)}
									</div>
									{#if activity.type === 'hajj'}
										<div
											class="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 transition-transform group-hover:scale-0">
										</div>
									{:else if activity.type === 'umrah'}
										<div
											class="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 transition-transform group-hover:scale-0">
										</div>
									{/if}
								</div>
								<div class="flex flex-1 flex-col justify-center">
									<div class="flex justify-between">
										<span class="text-sm font-medium text-secondary">{activity.name}</span>
										<span class="text-[10px] font-medium tracking-wide text-gray-300 uppercase"
											>{activity.time}</span>
									</div>
									<span class="text-xs text-gray-400">{activity.action}</span>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
