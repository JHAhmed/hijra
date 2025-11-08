<script>
	import Icon from "@iconify/svelte";

	let { currentStep, name } = $props();

	let steps = $derived.by(() => {

		let steps = [
			{ id: 1, name: 'Personal Information', status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'pending' },
			{ id: 2, name: 'Academic Details', status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'pending' },
			{ id: 3, name: 'Document Submission', status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'pending' },
			{ id: 4, name: 'Confirmation', status: currentStep === 4 ? 'current' : currentStep > 4 ? 'completed' : 'pending' }
		]

		return steps;
	});

</script>

<div class="w-full h-fit md:max-w-sm mx-auto md:mx-0 rounded-2xl bg-gray-50 p-8 py-12">
	<!-- Header Section: Contains the avatar and the user's name -->
	<div class="flex items-center space-x-5">
		<div class="relative shrink-0">
			<div class="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-300">
                    <Icon icon="heroicons:user-circle" class="size-16 text-gray-800" />
			</div>
		</div>
		<div class="w-fit">
			<h1 class="text-3xl text-wrap leading-tighter break-words tracking-tight font-semibold text-gray-800 max-w-58">{name.length > 3 ? name : "Student"}</h1>
		</div>
	</div>

	<!-- Timeline Section -->
	<!-- The container is positioned to align the timeline vertically under the center of the avatar -->
	<div class="relative mt-8 pl-9">

		<!-- This is the vertical connector line from the avatar to the first step of the timeline -->
		<div class="absolute top-[-2rem] left-[47px] h-10 w-0.5 bg-gray-300"></div>

		<!-- The list that holds the timeline steps -->
		<ol class="relative">
			<!-- A single vertical line that runs through all the steps for a clean look -->
			<div class="absolute top-0 left-[11px] h-full w-0.5 bg-gray-300"></div>

			<!-- We loop through the 'steps' array to render each step dynamically -->
			{#each steps as step (step.id)}
				<li class="relative flex items-start pb-10 last:pb-0">
					<!-- Status Circle: The appearance changes based on the step's status -->
					<div
						class="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full
                            {step.status === 'completed' ? 'bg-green-100' : ''}
                            {step.status === 'current' ? 'bg-blue-100' : ''}
                            {step.status === 'pending' ? 'border-2 border-gray-400 bg-white' : ''}"
					>
						<!-- Inner dot for 'completed' and 'current' states -->
						{#if step.status === 'completed'}
							<div class="h-2.5 w-2.5 rounded-full bg-green-500"></div>
						{/if}
						{#if step.status === 'current'}
							<div class="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></div>
						{/if}
					</div>

					<!-- Step Name: Text style also changes based on the status -->
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
