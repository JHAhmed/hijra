<script>
	import { auth } from '$lib/auth.svelte.js';
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/utils.js'; // Assuming you have this, otherwise just use string interpolation

	let {
		label,
		name = 'Input',
		type = 'text',
		maxlength = 50,
		min = 0,
		max = 100,
		placeholder = 'John Doe',
		required = true,
		icon = 'heroicons:user-circle',
		allowView = false,
		error = '',
		accept = '',
		validator,
		class: className = '',
		value = $bindable()
	} = $props();

	const inputId = name.toLowerCase().replace(/\s+/g, '-');
</script>

<div class="w-full">
	{#if label}
		<label for={inputId} class="mb-2 block text-sm font-medium text-secondary">
			{label}
			{#if required && type === 'file'}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<div class="relative rounded-xl">
		<input
			onchange={validator}
			id={inputId}
			{name}
			{type}
			{max}
			{min}
			{maxlength}
			bind:value
			{placeholder}
			class={cn(
				'block w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-10 text-sm text-secondary placeholder-gray-400 transition-all duration-200',
				'focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none',
				'disabled:bg-gray-50 disabled:text-gray-400',
				error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'hover:border-gray-300',
				className
			)} />

		{#if icon && !allowView}
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
				<Icon {icon} class="h-5 w-5 text-gray-400" />
			</div>
		{:else if allowView}
			<div class="absolute inset-y-0 right-0 flex items-center pr-3">
				<button
					type="button"
					class="text-gray-400 transition-colors hover:text-secondary focus:outline-none"
					onclick={() => {
						type = type === 'password' ? 'text' : 'password';
					}}
					tabindex="-1">
					{#if type === 'password'}
						<Icon icon="heroicons:eye" class="h-5 w-5" />
					{:else}
						<Icon icon="heroicons:eye-slash" class="h-5 w-5" />
					{/if}
				</button>
			</div>
		{/if}
	</div>

	{#if error}
		<p class="mt-1.5 text-xs text-red-500">{error}</p>
	{/if}
</div>

<style>
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		margin: 0;
	}
</style>
