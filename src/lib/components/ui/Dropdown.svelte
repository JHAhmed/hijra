<script>
	import Icon from '@iconify/svelte';
	import { Select } from 'bits-ui';
	let {
		label,
		name = 'Input',
		icon = 'heroicons:chevron-down',
		value = $bindable(),
		error = '',
		contentProps,
		placeholder,
		items,
		...restProps
	} = $props();

	// const selectedLabel = $derived(items.find((item) => item.value === value)?.label);

	const selectedLabel = $derived(
		value ? items.find((item) => item.value === value)?.label : 'Select an option'
	);
</script>

<div class="w-full">
	{#if label}
		<label
			for={name.toLowerCase().replace(/\s+/g, '-')}
			class="mb-0.5 block text-xs font-medium text-gray-700 sm:text-sm">{label}</label>
	{/if}

	<Select.Root
		name={name.toLowerCase().replace(/\s+/g, '-')}
		type="single"
		bind:value
		{...restProps}>
		<Select.Trigger
			class="relative w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-left text-xs text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none sm:text-sm">
			{selectedLabel ? selectedLabel : placeholder}

			{#if icon}
				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
					<Icon {icon} class="h-6 w-fit text-gray-400" />
				</div>
			{/if}
		</Select.Trigger>
		<Select.Portal>
			<Select.Content
				{...contentProps}
				class="mt-1 w-(--bits-select-anchor-width) min-w-(--bits-select-anchor-width) z-50 rounded-lg border border-gray-300 bg-white text-xs sm:text-sm">
				<!-- <Select.ScrollUpButton>up</Select.ScrollUpButton> -->
				<Select.Viewport class="space-y-1 p-1">
					{#each items as { value, label, disabled } (value)}
						<Select.Item
							{value}
							{label}
							{disabled}
							class="flex w-full  items-center justify-between rounded-md p-3 text-xs hover:bg-gray-100 sm:text-sm {label ===
							selectedLabel
								? 'bg-gray-50'
								: ''} {disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}">
							{#snippet children({ selected })}
								<!-- {selected ? '✅' : ''} -->
								<!-- {selected ? '✅' : ''} -->
								<p class="text-left text-xs sm:text-sm">{label}</p>
								{#if selected}
									<Icon icon="ph:check" class="inline-block" />
								{/if}
							{/snippet}
						</Select.Item>
					{/each}
				</Select.Viewport>
				<!-- <Select.ScrollDownButton>down</Select.ScrollDownButton> -->
			</Select.Content>
		</Select.Portal>
	</Select.Root>
	{#if error}
		<p class="mt-1 text-xs text-red-500 sm:text-sm">{error}</p>
	{/if}
</div>
