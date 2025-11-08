<script>
	import Icon from '@iconify/svelte';
	import { Select } from 'bits-ui';
	let {
		label,
		name = 'Input',
        icon = 'heroicons:chevron-down',
		value = $bindable(),
		items,
		contentProps,
		placeholder,
		error = "",
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
			class="mb-0.5 block text-sm font-medium text-gray-700">{label}</label
		>
	{/if}
	
	<Select.Root name={name.toLowerCase().replace(/\s+/g, '-')} type="single" bind:value {...restProps}>
		<Select.Trigger
			class="w-full text-left relative rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none text-xs md:text-sm focus:border-gray-400"
		>
			{selectedLabel ? selectedLabel : placeholder}
	
			{#if icon}
				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
					<Icon {icon} class="h-6 w-fit text-gray-400" />
				</div>
			{/if}
	
		</Select.Trigger>
		<Select.Portal>
			<Select.Content {...contentProps} class="min-w-[var(--bits-select-anchor-width)] w-[var(--bits-select-anchor-width)] rounded-lg border border-gray-300 bg-white mt-1 text-xs md:text-sm">
				<!-- <Select.ScrollUpButton>up</Select.ScrollUpButton> -->
				<Select.Viewport>
					{#each items as { value, label, disabled } (value)}
						<Select.Item {value} {label} {disabled} class="p-3 w-full my-1 mx-1 rounded-md text-xs md:text-sm flex justify-between items-center hover:bg-gray-100 {label === selectedLabel ? 'bg-gray-50' : ''} {disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}">
							{#snippet children({ selected })}
								<!-- {selected ? '✅' : ''} -->
								<!-- {selected ? '✅' : ''} -->
								<p class="text-left text-xs md:text-sm">{label}</p>
								 {#if selected}
									<Icon icon="mdi:check" class="inline-block" />
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
        <p class="mt-1 text-xs md:text-sm text-red-500">{error}</p>
    {/if}
</div>
