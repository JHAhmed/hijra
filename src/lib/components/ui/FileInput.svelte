<script>
	import { auth } from '$lib/auth.svelte.js';
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/utils.js';

	let {
		label,
		name = 'Input',
		placeholder = 'John Doe',
		required = true,
		icon = 'heroicons:cloud-arrow-up', // Changed default icon to fit context better
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
			fileName = originalFile.name;

			const newFileName = generateCustomFileName(originalFile);
			const renamedFile = new File([originalFile], newFileName, {
				type: originalFile.type,
				lastModified: originalFile.lastModified
			});

			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(renamedFile);
			value = dataTransfer.files;
		} else {
			fileName = '';
			value = undefined;
		}

		if (validator) {
			validator(e);
		}
	}

	function generateCustomFileName(file) {
		const timestamp = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
		const extension = file.name.split('.').pop();
		const userName = auth.user?.name ? auth.user?.name.replace(/\s+/g, '-') : 'user';
		return `${userName} ${uploadName}.${extension}`;
	}
</script>

<div class="w-full">
	{#if label}
		<label for={inputId} class="mb-2 block text-sm font-medium text-secondary">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<div class="relative rounded-xl">
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
			class={cn(
				'block w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-10 text-sm text-secondary transition-all duration-200',
				'hover:border-primary/50 hover:bg-gray-50',
				'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:outline-none',
				error && 'border-red-500'
			)}>
			<span class={cn('block truncate', fileName ? 'font-medium text-secondary' : 'text-gray-400')}>
				{fileName || 'Choose a file...'}
			</span>
		</label>

		{#if icon}
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
				<Icon {icon} class="h-5 w-5 text-gray-400" />
			</div>
		{/if}

		{#if accept}
			<p class="mt-1.5 px-1 text-xs text-gray-400">
				Supported formats: {accept.split(',').join(', ')}
			</p>
		{/if}
	</div>

	{#if error}
		<p class="mt-1.5 text-xs text-red-500">{error}</p>
	{/if}
</div>
