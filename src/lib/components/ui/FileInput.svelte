<script>
	import { auth } from '$lib/auth.svelte.js';
	import Icon from '@iconify/svelte';

	let {
		label,
		name = 'Input',
		placeholder = 'John Doe',
		required = true,
		icon = 'heroicons:user-circle',
		uploadName = '',
		value = $bindable(),
		validator,
		error = '',
		accept = ''
	} = $props();

	const inputId = name.toLowerCase().replace(/\s+/g, '-');
	let fileName = $state('');

	function handleFileChange(e) {
		const files = e.target.files;
		if (files && files.length > 0) {
			const originalFile = files[0];

			// Display the original filename to the user
			fileName = originalFile.name;

			// Create a new File object with a custom name
			const newFileName = generateCustomFileName(originalFile);
			const renamedFile = new File([originalFile], newFileName, {
				type: originalFile.type,
				lastModified: originalFile.lastModified
			});

			// Create a new FileList-like structure with the renamed file
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(renamedFile);

			// Update the bound value with the renamed file
			value = dataTransfer.files;
		} else {
			fileName = '';
			value = undefined;
		}

		if (validator) {
			validator(e);
		}
	}

	// Helper function to generate custom filename
	function generateCustomFileName(file) {
		const timestamp = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
		const extension = file.name.split('.').pop();
		const baseName = file.name.replace(/\.[^/.]+$/, '');
		const userName = auth.user?.name ? auth.user?.name.replace(/\s+/g, '-') : 'user';

		// return `${userName}_${timestamp}_${baseName}.${extension}`;
		return `${userName} ${uploadName}.${extension}`;
	}
</script>

<div class="w-full">
	{#if label}
		<label for={inputId} class="mb-0.5 block text-xs font-medium text-gray-700 sm:text-sm"
			>{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<div class="relative rounded-md">
		<input
			type="file"
			{name}
			id={inputId}
			class="hidden"
			onchange={handleFileChange}
			{accept}
			{required} />

		<label
			for={inputId}
			class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-xs text-gray-900 placeholder-gray-400 focus-within:border-gray-400 focus-within:ring-0 focus-within:outline-none sm:text-sm">
			<span class="truncate {fileName ? 'text-gray-900' : 'text-gray-400'}">
				{fileName || 'Choose a file...'}
			</span>
		</label>
		{#if icon}
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
				<Icon {icon} class="h-6 w-fit text-gray-400" />
			</div>
		{/if}
		<p class="absolute inset-x-0 -bottom-5 mt-1 text-xs text-gray-600">
			{accept ? `Accepted formats: ${accept}` : ''}
		</p>
	</div>

	{#if error}
		<p class="mt-6 text-xs text-red-500">{error}</p>
	{/if}
</div>
