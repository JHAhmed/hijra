<script>
	import Icon from '@iconify/svelte';
	import { Select } from 'bits-ui';
	import { cn } from '$lib/utils.js';

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

	const selectedLabel = $derived(
		value ? items.find((item) => item.value === value)?.label : 'Select an option'
	);
</script>

<div class="w-full">
	{#if label}
		<label
			for={name.toLowerCase().replace(/\s+/g, '-')}
			class="mb-2 block text-sm font-medium text-secondary">
			{label}
		</label>
	{/if}

	<Select.Root
		name={name.toLowerCase().replace(/\s+/g, '-')}
		type="single"
		bind:value
		{...restProps}>
		<Select.Trigger
			class={cn(
				'relative w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-10 text-left text-sm text-secondary placeholder-gray-400 transition-all duration-200',
				'focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none',
				'hover:border-gray-300',
				error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
			)}>
			<span class={!value ? 'text-gray-400' : ''}>
				{selectedLabel ? selectedLabel : placeholder}
			</span>

			{#if icon}
				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
					<Icon {icon} class="h-5 w-5 text-gray-400" />
				</div>
			{/if}
		</Select.Trigger>

		<Select.Portal>
			<Select.Content
				{...contentProps}
				class="z-50 mt-1 w-(--bits-select-anchor-width) min-w-(--bits-select-anchor-width) rounded-xl border border-gray-100 bg-white p-1 text-sm shadow-xl shadow-gray-200/50">
				<Select.Viewport class="space-y-0.5">
					{#each items as { value, label, disabled } (value)}
						<Select.Item
							{value}
							{label}
							{disabled}
							class="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors outline-none
                            data-[highlighted]:bg-gray-50 data-[highlighted]:text-primary
                            {disabled ? 'cursor-not-allowed opacity-50' : ''}">
							{#snippet children({ selected })}
								<p class="text-left font-medium {selected ? 'text-primary' : 'text-secondary'}">
									{label}
								</p>
								{#if selected}
									<Icon icon="heroicons:check-16-solid" class="h-4 w-4 text-primary" />
								{/if}
							{/snippet}
						</Select.Item>
					{/each}
				</Select.Viewport>
			</Select.Content>
		</Select.Portal>
	</Select.Root>

	{#if error}
		<p class="mt-1.5 text-xs text-red-500">{error}</p>
	{/if}
</div>
