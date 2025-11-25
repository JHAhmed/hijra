<script>
	import Icon from '@iconify/svelte';

	const steps = [
		{
			name: 'Packages',
			icon: 'ph:package',
			status: 'completed'
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
					circle: 'bg-primary border-primary',
					icon: 'text-white',
					text: 'text-primary font-bold',
					connector: 'bg-primary'
				};
			case 'current':
				return {
					circle: 'bg-secondary border-secondary shadow-[0_0_0_4px_rgba(0,0,0,0.1)]',
					icon: 'text-white',
					text: 'text-secondary font-bold',
					connector: 'bg-gray-200'
				};
			default:
				return {
					circle: 'bg-white border-gray-200',
					icon: 'text-gray-400',
					text: 'text-gray-400',
					connector: 'bg-gray-200'
				};
		}
	}
</script>

<section class="my-8 w-full border-y border-gray-100 bg-gray-50 py-8 md:py-12">
	<div class="mx-auto max-w-8xl px-6 md:px-12">
		<div class="mb-12">
			<span class="mb-3 block text-xs font-bold tracking-widest text-primary uppercase">
				Track Progress
			</span>
			<h2 class="text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
				Your Application <span class="text-primary">Journey</span>
			</h2>
		</div>

		<div class="relative">
			<!-- Desktop Layout -->
			<div class="hidden md:block">
				<div class="relative flex items-center justify-between">
					{#each steps as step, index}
						{@const classes = getStepClasses(step.status)}

						<div class="relative flex flex-col items-center">
							<!-- Circle -->
							<div
								class="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-300 {classes.circle}">
								{#if step.status === 'completed'}
									<Icon icon="heroicons:check-16-solid" class="h-6 w-6 {classes.icon}" />
								{:else}
									<Icon icon={step.icon} class="h-6 w-6 {classes.icon}" />
								{/if}
							</div>

							<!-- Label -->
							<div class="mt-4 text-center">
								<p class="text-sm transition-colors duration-300 {classes.text}">
									{step.name}
								</p>
							</div>

							<!-- Connector Line -->
							<!-- {#if index < steps.length - 1}
								<div
									class="absolute top-7 left-7 h-0.5 w-[calc(100vw/6-3.5rem)] {classes.connector} transition-colors duration-300">
								</div>
							{/if} -->
						</div>
					{/each}
				</div>
			</div>

			<!-- Mobile Layout -->
			<div class="md:hidden">
				<div class="space-y-6">
					{#each steps as step, index}
						{@const classes = getStepClasses(step.status)}

						<div class="relative flex items-center gap-4">
							<!-- Circle -->
							<div
								class="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 {classes.circle}">
								{#if step.status === 'completed'}
									<Icon icon="heroicons:check-16-solid" class="h-5 w-5 {classes.icon}" />
								{:else}
									<Icon icon={step.icon} class="h-5 w-5 {classes.icon}" />
								{/if}
							</div>

							<!-- Content -->
							<div class="flex-1">
								<p class="text-base transition-colors duration-300 {classes.text}">
									{step.name}
								</p>
							</div>

							<!-- Connector Line -->
							{#if index < steps.length - 1}
								<div
									class="absolute top-12 left-6 h-6 w-0.5 {classes.connector} transition-colors duration-300">
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
