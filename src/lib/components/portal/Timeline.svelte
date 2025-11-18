<script>
	import Icon from '@iconify/svelte';

	const steps = [
		{
			name: 'Packages',
			icon: 'ph:package',
			status: 'completed' // completed, current, upcoming
		},
		{
			name: 'Application',
			icon: 'ph:users-four',
			status: 'current'
		},
		{
			name: 'Documents',
			icon: 'ph:files',
			status: 'upcoming'
		},
		{
			name: 'Payment',
			icon: 'ph:credit-card',
			status: 'upcoming'
		},
		{
			name: 'Journey',
			icon: 'ph:calendar-check',
			status: 'upcoming'
		},
		{
			name: 'Tracking',
			icon: 'ph:clipboard-text',
			status: 'upcoming'
		}
	];

	function getStepClasses(status) {
		switch (status) {
			case 'completed':
				return {
					circle: 'bg-green-500 border-green-500',
					icon: 'text-white',
					text: 'text-green-600 font-medium',
					line: 'bg-green-500'
				};
			case 'current':
				return {
					circle: 'bg-blue-500 border-blue-500 ring-4 ring-blue-100',
					icon: 'text-white',
					text: 'text-blue-600 font-semibold',
					line: 'bg-gray-300'
				};
			default:
				return {
					circle: 'bg-white border-gray-300',
					icon: 'text-gray-400',
					text: 'text-gray-500',
					line: 'bg-gray-300'
				};
		}
	}
</script>

<div class="overflow-hidden mx-4 md:mx-8 lg:mx-16 mb-4 rounded-2xl bg-gray-50 p-4 sm:p-6">
	<h3 class="mb-6 text-center text-lg font-medium text-gray-800 ">
		Your Application Progress
	</h3>

	<!-- Desktop & Tablet View -->
	<div class="">
		<div class="relative">
			<div class="flex flex-col md:flex-row space-y-8 md:space-y-0 items-center justify-between">
				{#each steps as step, index}
					{@const classes = getStepClasses(step.status)}
					<div class="flex flex-1 flex-col items-center justify-center">
						<!-- Step Circle -->
						<div class="relative z-10">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 {classes.circle}"
							>
								{#if step.status === 'completed'}
									<Icon icon="ph:check-bold" class="h-5 w-5 {classes.icon}" />
								{:else}
									<Icon icon={step.icon} class="h-5 w-5 {classes.icon}" />
								{/if}
							</div>
						</div>

						<!-- Step Name -->
						<p class="mt-3 text-center text-xs transition-colors duration-300 {classes.text} sm:text-sm">
							{step.name}
						</p>

						<!-- Connection Line -->
						<!-- {#if index < steps.length - 1}
							<div
								class="absolute left-0 top-6 z-0 h-0.5 w-full transition-colors duration-300 {classes.line}"
								style="left: {(index / (steps.length - 1)) * 100}%; width: {100 / (steps.length - 1)}%"
							></div>
						{/if} -->
					</div>
				{/each}
			</div>
		</div>
	</div>


	<!-- Progress Percentage -->
	<!-- {@const completedCount = steps.filter((s) => s.status === 'completed').length}
	{@const progressPercent = (completedCount / steps.length) * 100}
	<div class="mt-6 pt-6 border-t border-gray-100">
		<div class="flex items-center justify-between mb-2">
			<span class="text-sm font-medium text-gray-700">Overall Progress</span>
			<span class="text-sm font-semibold text-blue-600">{Math.round(progressPercent)}%</span>
		</div>
		<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
			<div
				class="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
				style="width: {progressPercent}%"
			></div>
		</div>
	</div> -->
</div>