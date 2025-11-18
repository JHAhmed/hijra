<script>
	import { DateField } from 'bits-ui';
	import { today, getLocalTimeZone, CalendarDateTime } from '@internationalized/date';
	import Icon from '@iconify/svelte';
	let {
		label,
		name = 'dob',
		showLabel = true,
		placeholder = 'DD/MM/YYYY',
		required = true,
		icon = 'heroicons:calendar',
		value = $bindable(),
		error = ''
	} = $props();

	const todayDate = today(getLocalTimeZone());
	const minValue = todayDate.subtract({ days: 1 });
	const maxValue = todayDate.add({ months: 2 });

	let valid = $derived.by(() => {
		return value >= minValue && value <= maxValue;
	});

	// const minValue = new CalendarDateTime(1980, 1, 1);
	// const todayDate = today(getLocalTimeZone());
</script>

<div class="w-full">
	{#if label}
		<label
			for={name.toLowerCase().replace(/\s+/g, '-')}
			class="mb-0.5 block text-xs font-medium text-gray-700 sm:text-sm">{label}</label>
	{/if}

	<DateField.Root bind:value {minValue} maxValue={todayDate} locale="en-GB">
		<div
			name={name.toLowerCase().replace(/\s+/g, '-')}
			class="relative flex w-full max-w-full flex-col gap-1.5">
			<!-- <DateField.Label class="block text-xs sm:text-sm font-medium select-none">{}</DateField.Label> -->
			<DateField.Input
				class="block w-full rounded-lg border border-gray-300 bg-white px-2 py-3 pr-10  text-xs text-gray-900 placeholder-gray-400 focus-within:border-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none sm:text-sm">
				{#snippet children({ segments })}
					{#each segments as { part, value }, i (part + i)}
						<div class="inline-block select-none">
							<DateField.Segment
								{part}
								class="rounded px-2 py-1  invalid:text-red-500 hover:bg-black/3 focus:bg-black/5 focus:text-black focus:outline-1 focus:outline-gray-600 focus-visible:ring-0! focus-visible:ring-offset-0! aria-[valuetext=Empty]:text-black/50">
								{value}
							</DateField.Segment>
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
