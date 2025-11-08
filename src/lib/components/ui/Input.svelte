<script>
	import { auth } from '$lib/auth.svelte.js';
	import Icon from '@iconify/svelte';

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
		uploadName = '',
		value = $bindable(),
		validator,
		allowView = false,
		error = '',
		accept = ''
	} = $props();

	// A unique ID for linking the label to the hidden input
	const inputId = name.toLowerCase().replace(/\s+/g, '-');

	// Local state to hold the display name of the selected file
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
    // const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const timestamp = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const extension = file.name.split('.').pop();

	// Remove extension and replace spaces with underscores
    const baseName = file.name.replace(/\.[^/.]+$/, ''); 
    
	// take auth.user.name and replace spaces with hyphens
	const userName = auth.user?.name ? auth.user?.name.replace(/\s+/g, '-') : 'user';


	// Example format: John-Doe_2023-10-05_15-30-00_filename.ext
	// return `${userName}_${timestamp}_${baseName}.${extension}`;
	return `${userName} ${uploadName}.${extension}`;
}

</script>

<div class="w-full">
	{#if label}
		<label for={inputId} class="mb-0.5 block text-sm font-medium text-gray-700">{label}
			{#if required && type === 'file'}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	{#if type === 'file'}
		<div class="relative rounded-md">
			<input
				type="file"
				{name}
				id={inputId}
				class="hidden"
				onchange={handleFileChange}
				{accept}
				{required}
			/>
			<!-- <p class="mt-1 text-xs text-gray-600">{accept ? `Accepted formats: ${accept}` : ''}</p> -->

			<label
				for={inputId}
				class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 focus-within:border-gray-400 focus-within:ring-0 focus-within:outline-none sm:text-sm"
			>
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
	{:else}
		<div class="relative rounded-md">
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
				class="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-xs text-gray-900 placeholder-gray-400 invalid:border-red-500 focus:border-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
			/>
			{#if icon && !allowView}
				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
					<Icon {icon} class="h-6 w-fit text-gray-400" />
				</div>
			{:else if allowView}
				<div class="absolute inset-y-0 right-0 flex items-center pr-3">
					<button
						type="button"
						class="text-gray-400 focus:outline-none"
						onclick={() => {
							type = type === 'password' ? 'text' : 'password';
						}}
						tabindex="-1"
					>
						{#if type === 'password'}
							<Icon icon="heroicons:eye" class="h-6 w-fit" />
						{:else}
							<Icon icon="heroicons:eye-slash" class="h-6 w-fit" />
						{/if}
					</button>
				</div>
			{/if}
		</div>
	{/if}

	{#if error}
		<p class="{type === 'file' ? 'mt-6' : 'mt-1 '} text-xs text-red-500">{error}</p>
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
