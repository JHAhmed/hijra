<script>
	import { DateField } from 'bits-ui';
	import { today, getLocalTimeZone } from '@internationalized/date';
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/utils.js';

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
</script>

<div class="w-full">
	{#if label && showLabel}
		<label
			for={name.toLowerCase().replace(/\s+/g, '-')}
			class="mb-2 block text-sm font-medium text-secondary">
			{label}
		</label>
	{/if}

	<DateField.Root bind:value {minValue} maxValue={todayDate} locale="en-GB">
		<div
			name={name.toLowerCase().replace(/\s+/g, '-')}
			class="relative flex w-full max-w-full flex-col gap-1.5">
			<DateField.Input
				class={cn(
					'flex w-full items-center rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-10 text-sm text-secondary transition-all duration-200',
					'hover:border-gray-300',
					'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:outline-none',
					error && 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500'
				)}>
				{#snippet children({ segments })}
					{#each segments as { part, value }, i (part + i)}
						<div class="inline-block select-none">
							<DateField.Segment
								{part}
								class="rounded p-0.5 focus:bg-primary/10 focus:text-primary focus:outline-none aria-[valuetext=Empty]:text-gray-400">
								{value}
							</DateField.Segment>
						</div>
					{/each}
				{/snippet}
			</DateField.Input>

			{#if icon}
				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
					<Icon {icon} class="h-5 w-5 text-gray-400" />
				</div>
			{/if}
		</div>
	</DateField.Root>

	{#if error}
		<p class="mt-1.5 text-xs text-red-500">{error}</p>
	{/if}
</div>
