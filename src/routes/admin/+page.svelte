<script>
	import { onMount } from 'svelte';
	import { tablesDB } from '$lib/appwrite';
	import { toast, Toaster } from 'svelte-sonner';

	import Modal from '$components/ui/Modal.svelte';

	let isLoading = $state(true);
	let totalUsers = $state(0);
	let totalShortlisted = $state(0);
	let applicationsProcessed = $state(0);

	let users = $state([]);

	let interested = $state({
		total: 0,
		rows: []
	});

	let students = $state({
		total: 0,
		rows: []
	});


</script>

<Toaster position="bottom-right" />

{#if isLoading}
	<Modal text="Loading..." />
{/if}

<div
	class="flex h-full min-h-[70vh] w-full flex-col items-start justify-start space-y-4 p-2 sm:p-4">
	<h1 class="text-2xl font-medium tracking-tight text-slate-800">Admin Dashboard</h1>
	<div class="h-px w-full bg-gray-200"></div>

	<div class="flex w-full flex-col space-y-4 p-2 sm:p-4 md:flex-row md:space-x-4 md:space-y-0">
		<div class="flex w-full flex-col space-y-4">
			<h1 class="text-left text-xl sm:text-2xl font-medium tracking-tight text-gray-800">Stats</h1>

			<div class="grid h-fit w-full grid-cols-1 gap-4 sm:grid-cols-2">
				<div
					class="flex flex-col items-center justify-center space-y-2 sm:space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
					<p class="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-800">{students.total}</p>
					<h2 class="text-sm sm:text-base tracking-tight text-gray-700">Total Users</h2>
				</div>
				<div
					class="flex flex-col items-center justify-center space-y-2 sm:space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
					<p class="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-800">{totalShortlisted}</p>
					<h2 class="text-sm sm:text-base tracking-tight text-gray-700">Total Shortlisted</h2>
				</div>
			</div>
			<div class="grid h-fit w-full grid-cols-1 gap-4 sm:grid-cols-2">
				<div
					class="flex flex-col items-center justify-center space-y-2 sm:space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
					<p class="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-800">{interested.total}</p>
					<h2 class="text-sm sm:text-base tracking-tight text-gray-700">Total Interested</h2>
				</div>
				<div
					class="flex flex-col items-center justify-center space-y-2 sm:space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
					<p class="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-800">
						{applicationsProcessed}
					</p>
					<h2 class="text-sm sm:text-base tracking-tight text-gray-700">Applications Approved</h2>
				</div>
			</div>
		</div>
		<div class="w-full md:w-1/3 rounded-xl border border-gray-200 bg-gray-50/50 p-2 sm:p-4">
			<h2 class="my-2 sm:my-4 text-center text-lg sm:text-xl font-medium tracking-tight text-slate-800">
				Latest Users
			</h2>

			<div class="flex flex-col space-y-2">
				{#each users as user, i}
					{#if user.fullName}
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0 sm:space-x-4 border-b border-gray-200 p-2 sm:p-3">
							<div class="flex flex-col">
								<p class="text-base sm:text-lg font-medium text-gray-800">{user.fullName}</p>
								<p class="text-xs sm:text-sm text-gray-500">{user.email}</p>
							</div>
						</div>
					{/if}
				{/each}
			</div>

			<div class="mt-4 flex w-full justify-center">
				<a
					href="admin/users"
					class="w-full rounded-lg bg-primary px-4 py-2 text-center text-white transition-colors hover:bg-primary/90">
					View All Users
				</a>
			</div>
		</div>
	</div>
</div>