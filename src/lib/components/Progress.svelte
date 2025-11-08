<script>
	import Icon from '@iconify/svelte';

	let {
		progress = {
			applicationSubmitted: false,
			applicationApproved: false,
			selectionSubmitted: false,
			selectionApproved: false,
			offerLetterReceived: false,
			documentsUploaded: false,
			documentsApproved: false,
			paymentCompleted: false,
			paymentApproved: false
		},
		name = 'Student'
	} = $props();

	const steps = [
		{ name: 'Application Submitted', key: 'applicationSubmitted', time: '3-4 days' },
		{ name: 'Application Approved', key: 'applicationApproved', time: '3-4 days' },
		{ name: 'University Preference Submitted', key: 'selectionSubmitted', time: '3-4 days' },
		{ name: 'University Preference Approved', key: 'selectionApproved', time: '3-4 days' },
		{ name: 'Offer Letter', key: 'offerLetterReceived', time: '3-4 days' },
		{ name: 'Documents Uploaded', key: 'documentsUploaded', time: '3-4 days' },
		{ name: 'Documents Approved', key: 'documentsApproved', time: '3-4 days' },
		{ name: 'Payment Completed', key: 'paymentCompleted', time: '3-4 days' },
		{ name: 'Payment Approved', key: 'paymentApproved', time: '3-4 days' }
	];
</script>

<div class="h-fit rounded-2xl bg-gray-50 p-8 py-12 md:mx-0 md:max-w-sm">
	<div class="flex items-center space-x-5">
		<div class="relative shrink-0">
			<div class="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-300">
				<Icon icon="heroicons:user-circle" class="size-16 text-gray-800" />
			</div>
		</div>
		<div class="w-fit">
			<h1
				class="leading-tighter max-w-58 text-3xl font-semibold tracking-tight break-words text-gray-800"
			>
				{name}
			</h1>
		</div>
	</div>

	<div class="relative mt-8 pl-9">
		<div class="absolute top-[-2rem] left-[47px] h-10 w-0.5 bg-gray-300"></div>

		<ol class="relative">
			<div class="absolute top-0 left-[11px] h-full w-0.5 bg-gray-300"></div>

			{#each steps as step (step.key)}
				<li class="relative flex items-start pb-10 last:pb-0">
					<div
						class="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2  bg-white
                            {progress[step.key] ? 'bg-green-100' : 'bg-gray-100'}"
					>
						{#if progress[step.key]}
							<div class="h-2.5 w-2.5 rounded-full bg-green-500"></div>
						{:else}
							<div class="h-2.5 w-2.5 rounded-full bg-gray-300"></div>
						{/if}

					</div>

					<div class="ml-4">
						<p
							class="pt-1 text-xs font-semibold tracking-wide uppercase
                                {step.status === 'pending' ? 'text-gray-400' : 'text-gray-700'}"
						>
							{step.name}
						</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</div>
