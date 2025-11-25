<script>
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';
	import FileInput from '$components/ui/FileInput.svelte';
	import Button from '$components/ui/Button.svelte';

	// Mock Data: Hardcoded 3 family members + Lead as requested
	// In production, fetch this from load() based on the application ID
	let pilgrims = $state([
		{
			id: 1,
			type: 'lead',
			name: 'Yusuf Ahmed',
			relation: 'Lead Pilgrim',
			docs: { passportFront: undefined, passportBack: undefined, photo: undefined }
		},
		{
			id: 2,
			type: 'family',
			name: 'Sarah Ahmed',
			relation: 'Spouse',
			docs: { passportFront: undefined, passportBack: undefined, photo: undefined }
		},
		{
			id: 3,
			type: 'family',
			name: 'Omar Ahmed',
			relation: 'Child',
			docs: { passportFront: undefined, passportBack: undefined, photo: undefined }
		},
		{
			id: 4,
			type: 'family',
			name: 'Fatima Ahmed',
			relation: 'Child',
			docs: { passportFront: undefined, passportBack: undefined, photo: undefined }
		}
	]);

	let loading = $state(false);

	async function handleSave() {
		loading = true;
		// Simulate upload
		setTimeout(() => {
			loading = false;
			goto('/hijrah-portal/application/success');
		}, 2000);
	}
</script>

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
			{#each pilgrims as person, i}
				<div
					in:fade={{ delay: i * 100 }}
					class="overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-100 hover:shadow-md/5">
					<div
						class="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
						<div class="flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-400">
								{i + 1}
							</div>
							<div>
								<h3 class="text-lg font-bold text-secondary">{person.name}</h3>
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
								uploadName={`${person.name}_Passport_Front`}
								accept=".jpg,.png,.pdf"
								bind:value={person.docs.passportFront} />

							<FileInput
								label="Passport Back"
								icon="ph:passport"
								uploadName={`${person.name}_Passport_Back`}
								accept=".jpg,.png,.pdf"
								bind:value={person.docs.passportBack} />

							<FileInput
								label="Passport Photo"
								icon="heroicons:camera"
								uploadName={`${person.name}_Photo`}
								accept=".jpg,.png"
								bind:value={person.docs.photo} />
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-10 flex justify-end gap-4 border-t border-gray-200 pt-8">
			<Button size="md" href="/hijrah-portal" variant="secondary" text="Finish Later" class="" />
			<Button
				size="md"
				onclick={handleSave}
				{loading}
				variant="primary"
				text="Save All Documents" />
		</div>
	</div>
</div>
