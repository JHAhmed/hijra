<script>
	import { authStore } from '$lib/auth.svelte.js';
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
		accept = '',
		maxSizeMB = 1, // Max file size in MB after compression
		maxWidth = 1920, // Max image width
		maxHeight = 1920 // Max image height
	} = $props();

	const inputId = `file-input-${Math.random().toString(36).slice(2)}`;
	let fileName = $state('');
	let isProcessing = $state(false);

	/**
	 * Compress an image file using Canvas API
	 * Returns a compressed File object
	 */
	async function compressImage(file, maxWidth, maxHeight, quality = 0.8) {
		return new Promise((resolve, reject) => {
			// Skip compression for non-image files (like PDFs)
			if (!file.type.startsWith('image/')) {
				resolve(file);
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.onload = () => {
					// Calculate new dimensions while maintaining aspect ratio
					let { width, height } = img;
					
					if (width > maxWidth) {
						height = (height * maxWidth) / width;
						width = maxWidth;
					}
					if (height > maxHeight) {
						width = (width * maxHeight) / height;
						height = maxHeight;
					}

					// Create canvas and draw resized image
					const canvas = document.createElement('canvas');
					canvas.width = width;
					canvas.height = height;
					
					const ctx = canvas.getContext('2d');
					ctx.drawImage(img, 0, 0, width, height);

					// Convert to blob
					canvas.toBlob(
						(blob) => {
							if (!blob) {
								reject(new Error('Failed to compress image'));
								return;
							}
							
							// Create a new File from the blob
							const compressedFile = new File([blob], file.name, {
								type: 'image/jpeg',
								lastModified: file.lastModified
							});
							
							resolve(compressedFile);
						},
						'image/jpeg',
						quality
					);
				};
				img.onerror = () => reject(new Error('Failed to load image'));
				img.src = e.target.result;
			};
			reader.onerror = () => reject(new Error('Failed to read file'));
			reader.readAsDataURL(file);
		});
	}

	async function handleFileChange(e) {
		const files = e.target.files;
		if (files && files.length > 0) {
			const originalFile = files[0];
			fileName = originalFile.name;
			isProcessing = true;

			try {
				// Compress image if it's an image file and larger than maxSizeMB
				let processedFile = originalFile;
				const maxSizeBytes = maxSizeMB * 1024 * 1024;
				
				if (originalFile.type.startsWith('image/') && originalFile.size > maxSizeBytes) {
					processedFile = await compressImage(originalFile, maxWidth, maxHeight, 0.8);
					
					// If still too large, try more aggressive compression
					if (processedFile.size > maxSizeBytes) {
						processedFile = await compressImage(originalFile, maxWidth * 0.7, maxHeight * 0.7, 0.7);
					}
					
					console.log(`Compressed ${originalFile.name}: ${(originalFile.size / 1024).toFixed(0)}KB → ${(processedFile.size / 1024).toFixed(0)}KB`);
				}

				const newFileName = generateCustomFileName(processedFile);
				const renamedFile = new File([processedFile], newFileName, {
					type: processedFile.type,
					lastModified: processedFile.lastModified
				});

				const dataTransfer = new DataTransfer();
				dataTransfer.items.add(renamedFile);
				value = dataTransfer.files;
			} catch (err) {
				console.error('File processing error:', err);
				// Fall back to original file if compression fails
				const newFileName = generateCustomFileName(originalFile);
				const renamedFile = new File([originalFile], newFileName, {
					type: originalFile.type,
					lastModified: originalFile.lastModified
				});

				const dataTransfer = new DataTransfer();
				dataTransfer.items.add(renamedFile);
				value = dataTransfer.files;
			} finally {
				isProcessing = false;
			}
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
		const userName = authStore.user?.name ? authStore.user?.name.replace(/\s+/g, '-') : 'user';
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

	<div class=" rounded-xl">
		<input
			type="file"
			{name}
			id={inputId}
			class="hidden"
			onchange={handleFileChange}
			{accept}
			{required}
			disabled={isProcessing} />

		<label
			for={inputId}
			class={cn(
				'relative block w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-10 text-sm text-secondary transition-all duration-200',
				'hover:border-primary/50 hover:bg-gray-50',
				'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:outline-none',
				error && 'border-red-500',
				isProcessing && 'opacity-70 cursor-wait'
			)}>
			<span class={cn('block truncate', fileName ? 'font-medium text-secondary' : 'text-gray-400')}>
				{#if isProcessing}
					Optimizing image...
				{:else}
					{fileName || 'Choose a file...'}
				{/if}
			</span>

			{#if icon}
				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
					{#if isProcessing}
						<Icon icon="heroicons:arrow-path" class="h-6 w-fit text-primary animate-spin" />
					{:else}
						<Icon {icon} class="h-6 w-fit text-gray-400" />
					{/if}
				</div>
			{/if}
		</label>

		{#if accept}
			<p class="mt-1 px-1 text-xs text-gray-400">
				Supported formats: {accept.split(',').join(', ')}
			</p>
		{/if}
	</div>

	{#if error}
		<p class="mt-1 ml-1 text-xs text-red-500">{error}</p>
	{/if}
</div>
