<script>
	let {
		label = 'Name',
		maxlength = 10,
		placeholder = 'Phone',
		hasPrefix = true,
		required = true,
		prefixText = 91,
		onUnitChange = (e) => {},
		countryCode = $bindable('+91'),
		value = $bindable()
	} = $props();

	function handleKeyDown(event) {
		const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
		const isNumber = /[0-9]/.test(event.key);
		const isAllowedChar = /[+()]/.test(event.key);

		if (!isNumber && !isAllowedChar && !allowedKeys.includes(event.key)) {
			event.preventDefault();
		}
	}

	// let countryCode = $derived(prefixText ? `+${prefixText}` : '');
</script>

<div class="w-full">
	{#if label}
		<label
			for={label.toLowerCase().replace(/\s+/g, '-')}
			class="mb-0.5 block text-xs font-medium text-gray-700 sm:text-sm"
			>{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<div class="relative flex rounded-lg">
		{#if hasPrefix}
			<input
				type="tel"
				onkeydown={handleKeyDown}
				maxlength="4"
				bind:value={countryCode}
				class="inline-flex w-16 items-center justify-center rounded-l-lg border border-r-0 border-gray-300 bg-white px-2 py-3 text-xs text-gray-900 focus:border-gray-400 focus:ring-0 focus:outline-none sm:text-sm" />
		{/if}
		<input
			{maxlength}
			bind:value
			type="text"
			{required}
			{placeholder}
			class="block w-full {hasPrefix
				? 'rounded-l-none rounded-r-lg'
				: 'rounded-lg'} border border-gray-300 bg-white px-4 py-3 text-xs text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-0 focus:outline-none sm:text-sm" />
	</div>
</div>

<style>
	input[type='tel']::-webkit-inner-spin-button,
	input[type='tel']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		margin: 0;
	}
</style>
