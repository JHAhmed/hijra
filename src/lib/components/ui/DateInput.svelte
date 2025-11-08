<script>
	import { DateField } from 'bits-ui';
	import { today, getLocalTimeZone, CalendarDateTime  } from '@internationalized/date';
	import Icon from '@iconify/svelte';
	let {
		label,
		granularity = 'day',
		name = 'dob',
		showLabel = true,
		placeholder = 'DD/MM/YYYY',
		required = true,
		icon = 'heroicons:calendar',
		value = $bindable(),
		error = "",
	} = $props();

    const minValue = new CalendarDateTime(1980, 1, 1);
	const todayDate = today(getLocalTimeZone());
</script>

<div class="w-full">
	{#if label}
		<label
			for={name.toLowerCase().replace(/\s+/g, '-')}
			class="mb-0.5 block text-sm font-medium text-gray-700">{label}</label
		>
	{/if}

	<DateField.Root {granularity} bind:value {minValue} maxValue={todayDate} locale="en-GB">
		<div
			name={name.toLowerCase().replace(/\s+/g, '-')}
			class="relative flex w-full max-w-full flex-col gap-1.5"
		>
			<!-- <DateField.Label class="block text-sm font-medium select-none">{}</DateField.Label> -->
			<DateField.Input
				class="block w-full rounded-lg border border-gray-300 bg-white px-2 py-3 pr-10 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none text-xs md:text-sm"
			>
				{#snippet children({ segments })}
					{#each segments as { part, value }, i (part + i)}
						<div class="inline-block select-none">
							{#if part === 'literal'}
								<DateField.Segment {part} class=" p-1">
									{value}
								</DateField.Segment>
							{:else}
								<DateField.Segment
									{part}
									class="focus:bg-100 rounded-sm px-2 py-1 hover:bg-gray-50 focus:ring-0 focus:outline-1 data-invalid:text-red-400"
								>
									{value}
								</DateField.Segment>
							{/if}
						</div>
					{/each}
				{/snippet}
			</DateField.Input>
			{#if icon}
				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
					<Icon {icon} class="h-6 w-fit text-gray-400" />
				</div>
			{/if}
		</div>
	</DateField.Root>
		{#if error}
        <p class="mt-1 text-xs text-red-500">{error}</p>
    {/if}
</div>
