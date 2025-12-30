<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';
	import FileInput from '$components/ui/FileInput.svelte';
	import Button from '$components/ui/Button.svelte';
	import Modal from '$components/ui/Modal.svelte';

	import { authStore } from '$lib/auth.svelte';

	// Get Application ID from URL (required)
	const applicationId = $derived($page.url.searchParams.get('applicationId'));

	// Local state for pilgrim data (fetched from Appwrite)
	let leadPilgrim = $state(null);
	let familyMembers = $state([]);

	// Loading states
	let initialLoading = $state(true);
	let loading = $state(false);
	let uploadProgress = $state('');
	let fetchError = $state(null);
	
	// Read-only state
	let isCompleted = $state(false);
	let uploadedDocs = $state([]);

	/**
	 * Fetch pilgrim data from Appwrite via API
	 */
	async function fetchPilgrimData() {
		if (!applicationId && !authStore?.user) {
			initialLoading = false;
			return;
		}

		try {
			// First check user progress
			if (authStore?.user) {
				const progressRes = await fetch(`/api/user/progress?userId=${authStore.user.$id}`);
				const progressData = await progressRes.json();
				
				if (progressData.success && progressData.hasApplication && progressData.currentStep >= 3) {
					isCompleted = true;
				}
			}

			// Use applicationId from URL or from progress
			const appId = applicationId;
			if (!appId) {
				initialLoading = false;
				return;
			}

			const response = await fetch(`/api/pilgrims?applicationId=${appId}`);
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to fetch pilgrim data');
			}

			// Set local state with fetched data
			leadPilgrim = result.leadPilgrim;
			familyMembers = result.familyMembers || [];

			console.log('Fetched pilgrim data:', leadPilgrim, familyMembers);

			// Initialize docs objects for file uploads
			if (leadPilgrim && !leadPilgrim.docs) {
				leadPilgrim.docs = {
					passportFront: undefined,
					passportBack: undefined,
					photo: undefined
				};
			}

			familyMembers.forEach((member) => {
				if (!member.docs) {
					member.docs = { passportFront: undefined, passportBack: undefined, photo: undefined };
				}
			});
		} catch (error) {
			console.error('Failed to fetch pilgrim data:', error);
			fetchError = error.message;
		} finally {
			initialLoading = false;
		}
	}

	import { onMount } from 'svelte';

	// Fetch data on mount
	onMount(() => {
		fetchPilgrimData();
	});

	/**
	 * Upload a document for a pilgrim using the server API
	 */
	async function uploadDocument(pilgrimId, docType, fileList) {
		if (!fileList || fileList.length === 0) return null;

		const file = fileList[0];

		// Create FormData for file upload
		const formData = new FormData();
		formData.append('file', file);
		formData.append('pilgrimId', pilgrimId);
		formData.append('applicationId', applicationId);
		formData.append('docType', docType);
		formData.append('userId', authStore.user.$id);

		const response = await fetch('/api/documents', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			const result = await response.json();
			throw new Error(result.error || 'Failed to upload document');
		}

		return response.json();
	}

	async function handleSave() {
		if (!applicationId) {
			alert('Application ID is missing. Please complete the application form first.');
			goto('/hijrah-portal/application');
			return;
		}

		if (!leadPilgrim?.$id) {
			alert('Pilgrim data is missing. Please complete the application form first.');
			goto('/hijrah-portal/packages');
			return;
		}

		loading = true;

		try {
			// Upload lead pilgrim documents
			uploadProgress = `Uploading documents for ${leadPilgrim.firstName}...`;

			if (leadPilgrim.docs?.passportFront) {
				await uploadDocument(leadPilgrim.$id, 'passport_front', leadPilgrim.docs.passportFront);
			}

			if (leadPilgrim.docs?.passportBack) {
				await uploadDocument(leadPilgrim.$id, 'passport_back', leadPilgrim.docs.passportBack);
			}

			if (leadPilgrim.docs?.photo) {
				await uploadDocument(leadPilgrim.$id, 'photo', leadPilgrim.docs.photo);
			}

			// Upload family member documents
			for (const member of familyMembers) {
				if (!member.$id) continue;

				uploadProgress = `Uploading documents for ${member.firstName}...`;

				if (member.docs?.passportFront) {
					await uploadDocument(member.$id, 'passport_front', member.docs.passportFront);
				}

				if (member.docs?.passportBack) {
					await uploadDocument(member.$id, 'passport_back', member.docs.passportBack);
				}

				if (member.docs?.photo) {
					await uploadDocument(member.$id, 'photo', member.docs.photo);
				}
			}

			// Update application status via API
			uploadProgress = 'Finalizing...';
			const updateResponse = await fetch(`/api/applications/${applicationId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					status: 'docs_review',
					currentStep: 3
				})
			});

			if (!updateResponse.ok) {
				throw new Error('Failed to update application status');
			}

			loading = false;
			goto('/hijrah-portal/application/success');
		} catch (error) {
			console.error('Document upload failed:', error);
			loading = false;
			alert('Failed to upload documents. Please try again.');
		}
	}
</script>

{#if initialLoading}
	<Modal
		text="Loading pilgrim data..."
		description="Please wait while we fetch your application details." />
{/if}

{#if loading}
	<Modal
		text={uploadProgress || 'Uploading documents...'}
		description="Please do not close or refresh the page." />
{/if}

{#if isCompleted}
	<!-- Read-Only View -->
	<div class="min-h-screen bg-gray-50/50 pt-10 pb-20 text-secondary">
		<div class="mx-auto max-w-5xl px-6">
			<div class="mb-8 text-center">
				<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
					<Icon icon="heroicons:check-circle-solid" class="h-5 w-5" />
					Documents Uploaded
				</div>
				<h1 class="text-3xl font-semibold tracking-tighter md:text-5xl">
					Documents <span class="text-primary">Submitted</span>
				</h1>
				<p class="mt-4 text-gray-500">
					Your documents have been uploaded and are under review.
				</p>
			</div>

			<div class="overflow-hidden rounded-3xl border border-green-200 bg-white p-8">
				<div class="mb-6 flex items-center gap-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
						<Icon icon="heroicons:document-check" class="h-6 w-6 text-green-600" />
					</div>
					<div>
						<h3 class="font-bold text-secondary">Documents Under Review</h3>
						<p class="text-sm text-gray-500">Our team is verifying your uploaded documents</p>
					</div>
				</div>

				{#if leadPilgrim}
					<div class="space-y-4">
						<div class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">
							<div class="flex items-center gap-3">
								<div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
									{leadPilgrim.firstName?.[0]}{leadPilgrim.lastName?.[0]}
								</div>
								<div>
									<p class="font-medium text-secondary">{leadPilgrim.firstName} {leadPilgrim.lastName}</p>
									<p class="text-xs text-gray-500">Lead Pilgrim</p>
								</div>
							</div>
							<span class="flex items-center gap-1.5 text-xs font-bold text-green-600">
								<Icon icon="heroicons:check-circle-solid" class="h-4 w-4" />
								Submitted
							</span>
						</div>

						{#each familyMembers as member}
							<div class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">
								<div class="flex items-center gap-3">
									<div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-sm font-bold text-white">
										{member.firstName?.[0]}{member.lastName?.[0]}
									</div>
									<div>
										<p class="font-medium text-secondary">{member.firstName} {member.lastName}</p>
										<p class="text-xs text-gray-500">{member.relation}</p>
									</div>
								</div>
								<span class="flex items-center gap-1.5 text-xs font-bold text-green-600">
									<Icon icon="heroicons:check-circle-solid" class="h-4 w-4" />
									Submitted
								</span>
							</div>
						{/each}
					</div>
				{/if}

				<div class="mt-8 flex justify-center">
					<Button href="/hijrah-portal" text="Back to Portal" variant="secondary" />
				</div>
			</div>
		</div>
	</div>
{:else}
<div class="min-h-screen bg-gray-50/50 pt-10 pb-20 text-secondary">
	<div class="mx-auto max-w-5xl px-6">
		<div class="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
			<div>
				<span class="mb-3 block text-xs font-bold tracking-widest text-primary uppercase">
					Required Documents
				</span>
				<h1 class="text-3xl font-semibold tracking-tighter md:text-5xl">
					Upload <span class="text-primary">Documents.</span>
				</h1>
				<p class="mt-4 max-w-xl text-lg text-gray-500">
					Please provide clear scans for all travelers. These are required for visa processing.
				</p>
			</div>

			<div class="hidden md:block">
				<div
					class="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
					<Icon icon="heroicons:information-circle-solid" class="h-4 w-4" />
					Max file size: 5MB per file
				</div>
			</div>
		</div>

		<div class="space-y-8">
			{#if initialLoading}
				<!-- Loading state -->
			{:else if !applicationId}
				<!-- No application ID - show error -->
				<div
					class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
					<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
						<Icon icon="ph:warning" class="h-8 w-8 text-red-500" />
					</div>
					<h3 class="mb-2 text-xl font-bold text-secondary">Application ID Missing</h3>
					<p class="mb-6 max-w-md text-gray-500">
						No application ID was provided. Please start from the packages page.
					</p>
					<Button
						href="/hijrah-portal/packages"
						text="Select a Package"
						variant="primary"
						size="md" />
				</div>
			{:else if fetchError}
				<!-- Error state -->
				<div
					class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-red-200 bg-white py-20 text-center">
					<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
						<Icon icon="ph:warning" class="h-8 w-8 text-red-500" />
					</div>
					<h3 class="mb-2 text-xl font-bold text-secondary">Failed to Load Data</h3>
					<p class="mb-6 max-w-md text-gray-500">
						{fetchError}
					</p>
					<Button onclick={fetchPilgrimData} text="Try Again" variant="primary" size="md" />
				</div>
			{:else if !leadPilgrim}
				<!-- No pilgrim data - show redirect prompt -->
				<div
					class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
					<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
						<Icon icon="ph:warning" class="h-8 w-8 text-gray-400" />
					</div>
					<h3 class="mb-2 text-xl font-bold text-secondary">No Pilgrim Data Found</h3>
					<p class="mb-6 max-w-md text-gray-500">
						Please complete the application form first before uploading documents.
					</p>
					<Button
						href={`/hijrah-portal/application?applicationId=${applicationId}`}
						text="Complete Application"
						variant="primary"
						size="md" />
				</div>
			{:else}
				<div
					in:fade={{ delay: 50 }}
					class="overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-100 hover:shadow-md/5">
					<div
						class="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
						<div class="flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-400">
								1
							</div>
							<div>
								<h3 class="text-lg font-bold text-secondary">
									{leadPilgrim.firstName}
									{leadPilgrim.lastName}
								</h3>
								<p class="text-xs font-bold tracking-wider text-primary uppercase">Lead Pilgrim</p>
							</div>
						</div>

						<span
							class="hidden items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500 sm:inline-flex">
							Pending Uploads
						</span>
					</div>

					<div class="p-6 md:p-8">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
							<FileInput
								label="Passport Front"
								icon="ph:passport"
								uploadName={`${leadPilgrim.firstName}_${leadPilgrim.lastName}_Passport_Front`}
								accept=".jpg,.png,.pdf"
								bind:value={leadPilgrim.docs.passportFront} />

							<FileInput
								label="Passport Back"
								icon="ph:passport"
								uploadName={`${leadPilgrim.firstName}_${leadPilgrim.lastName}_Passport_Back`}
								accept=".jpg,.png,.pdf"
								bind:value={leadPilgrim.docs.passportBack} />

							<FileInput
								label="Passport Photo"
								icon="heroicons:camera"
								uploadName={`${leadPilgrim.firstName}_${leadPilgrim.lastName}_Photo`}
								accept=".jpg,.png"
								bind:value={leadPilgrim.docs.photo} />
						</div>
					</div>
				</div>

				{#if familyMembers && familyMembers.length > 0}
					{#each familyMembers as person, i}
						<div
							in:fade={{ delay: i * 100 }}
							class="overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-100 hover:shadow-md/5">
							<div
								class="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
								<div class="flex items-center gap-3">
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-400">
										{i + 2}
									</div>
									<div>
										<h3 class="text-lg font-bold text-secondary">
											{person.firstName}
											{person.lastName}
										</h3>
										<p class="text-xs font-bold tracking-wider text-primary uppercase">
											{person.relation}
										</p>
									</div>
								</div>

								<span
									class="hidden items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500 sm:inline-flex">
									Pending Uploads
								</span>
							</div>

							<div class="p-6 md:p-8">
								<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
									<FileInput
										label="Passport Front"
										icon="ph:passport"
										uploadName={`${person.firstName}_${person.lastName}_Passport_Front`}
										accept=".jpg,.png,.pdf"
										bind:value={person.docs.passportFront} />

									<FileInput
										label="Passport Back"
										icon="ph:passport"
										uploadName={`${person.firstName}_${person.lastName}_Passport_Back`}
										accept=".jpg,.png,.pdf"
										bind:value={person.docs.passportBack} />

									<FileInput
										label="Passport Photo"
										icon="heroicons:camera"
										uploadName={`${person.firstName}_${person.lastName}_Photo`}
										accept=".jpg,.png"
										bind:value={person.docs.photo} />
								</div>
							</div>
						</div>
					{/each}
				{/if}
			{/if}
		</div>

		<div class="mt-10 flex justify-end gap-4 border-t border-gray-200 pt-8">
			<Button
				size="md"
				href="/hijrah-portal"
				variant="secondary"
				text="Finish Later"
				class=""
				disabled={loading} />
			<Button
				size="md"
				onclick={handleSave}
				{loading}
				variant="primary"
				text={loading ? uploadProgress || 'Uploading...' : 'Save All Documents'} />
		</div>
	</div>
</div>
{/if}

