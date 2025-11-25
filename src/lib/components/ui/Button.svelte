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
		fullWidth = false,
		class: className = '',
		onclick = () => {},
		...rest
	} = $props();

	const variants = {
		primary: 'border border-secondary bg-secondary text-white shadow-none font-bold',
		secondary: 'border border-gray-200 bg-white text-secondary shadow-none font-bold',
		pill: 'border border-gray-300 bg-white text-gray-700 shadow-none',
		ghost: 'text-gray-700 hover:bg-gray-100',
		outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
		destructive: 'bg-red-600 text-white hover:bg-red-700'
	};

	const transitions = {
		large:
			'transition-all duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0',
		small:
			'transition-all duration-200 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0',
		ghost: 'transition-colors duration-200'
	};

	const shadows = {
		primary:
			'hover:shadow-[4px_4px_0px_0px_#00B77A] active:shadow-none active:hover:shadow-[2px_2px_0px_0px_#00B77A]',
		secondary:
			'hover:shadow-[4px_4px_0px_0px_#000] active:shadow-none active:hover:shadow-[2px_2px_0px_0px_#000]',
		pill: 'hover:shadow-sm active:shadow-none',
		outline: 'hover:shadow-sm active:shadow-none'
	};

	const sizeConfig = {
		sm: {
			regular: 'px-3 py-1.5 text-sm gap-1.5 h-10',
			largePill: 'px-4 py-2 text-sm gap-2 h-10',
			iconOnly: 'p-2'
		},
		md: {
			regular: 'px-4 py-2 text-base gap-2 h-11',
			largePill: 'px-10 py-3.5 text-sm gap-3 h-14',
			iconOnly: 'p-2.5'
		},
		lg: {
			regular: 'px-6 py-3 text-lg gap-3 h-12',
			largePill: 'px-12 py-4 text-base gap-4 h-16',
			iconOnly: 'p-3'
		}
	};

	const isLargePill = ['primary', 'secondary'].includes(variant);
	const isIconOnly = iconPos === 'only';
	const sizeClasses = isLargePill
		? sizeConfig[size].largePill
		: isIconOnly
			? sizeConfig[size].iconOnly
			: sizeConfig[size].regular;
	const iconSize = isIconOnly ? 'h-5 w-5' : 'h-4 w-4';

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
		'group/button inline-flex cursor-pointer items-center justify-center rounded-full font-medium focus:ring-0 focus:outline-none disabled:pointer-events-none disabled:opacity-50',
		fullWidth && 'w-full sm:w-auto',
		variants[variant],
		sizeClasses,
		isIconOnly && 'aspect-square',
		variant === 'primary' && cn(transitions.large, shadows.primary),
		variant === 'secondary' &&
			cn(transitions.large, 'hover:border-secondary hover:bg-gray-50', shadows.secondary),
		['pill', 'outline'].includes(variant) && cn(transitions.small, shadows[variant]),
		variant === 'ghost' && transitions.ghost,
		className
	)}
	{...rest}>
	{#if loading}
		<svg
			class={cn('animate-spin', iconSize)}
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
		<Icon {icon} class={iconSize} />
	{/if}

	{#if !isIconOnly && !loading}
		<span>{text}</span>
	{/if}

	{#if icon && iconPos === 'right' && !loading}
		<Icon
			{icon}
			class={cn(
				iconSize,
				variant === 'primary'
					? ''
					: 'transition-transform duration-300 group-hover/button:translate-x-1'
			)} />
	{/if}
</button>
