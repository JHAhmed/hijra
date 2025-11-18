<script>
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils.js';
	import Icon from '@iconify/svelte';

	let {
		text = '',
		icon = '',
		iconPos = 'right', // 'left', 'right', 'only'
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		href = '',
		class: className = '',
		onclick = () => {},
		...rest
	} = $props();

	const variants = {
		primary:
			'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md',
		secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
		pill: 'border border-gray-300 bg-white  text-gray-700  hover:bg-gray-50 rounded-full',

		ghost: 'text-gray-700 hover:bg-gray-100',
		outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
		destructive: 'bg-red-600 text-white hover:bg-red-700'
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm gap-1.5',
		md: 'px-4 py-2 text-base gap-2',
		lg: 'px-6 py-3 text-lg gap-3'
	};

	const iconOnlySizes = {
		sm: 'p-2',
		md: 'p-2.5',
		lg: 'p-3'
	};

	const focusRings = {
		primary: 'focus:ring-emerald-500 focus:ring-offset-emerald-50',
		secondary: 'focus:ring-gray-500 focus:ring-offset-gray-50',
		ghost: 'focus:ring-gray-500 focus:ring-offset-white',
		outline: 'focus:ring-gray-500 focus:ring-offset-white',
		destructive: 'focus:ring-red-500 focus:ring-offset-red-50'
	};

	const isIconOnly = iconPos === 'only';

	function handleClick() {
		if (href) {
			goto(href);
		} else {
			onclick();
		}
	}
</script>

<button
	{disabled}
	onclick={disabled || loading ? undefined : handleClick}
	class={cn(
		'disabled:pointer-events-not-allowed group/button inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-all duration-200 focus:ring-0 focus:outline-none disabled:opacity-50',
		variants[variant],
		isIconOnly ? iconOnlySizes[size] : sizes[size],
		// focusRings[variant],

		isIconOnly && 'aspect-square',
		className
	)}
	{...rest}>
	{#if loading}
		<svg
			class={cn('animate-spin', isIconOnly ? 'h-5 w-5' : 'h-4 w-4')}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	{:else if icon && (iconPos === 'left' || iconPos === 'only')}
		<Icon {icon} class={cn(isIconOnly ? 'h-5 w-5' : 'h-4 w-4')} />
	{/if}

	{#if !isIconOnly && !loading}
		<span>{text}</span>
	{/if}

	{#if icon && iconPos === 'right' && !loading}
		<Icon {icon} class="h-4 w-4 transition-all duration-200 group-hover/button:ml-2" />
	{/if}
</button>
