<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import Icon from '@iconify/svelte';

	import favicon from '$lib/assets/favicon.svg';
	import { user } from '$lib/unused/user.svelte.js';
	import { innerWidth } from 'svelte/reactivity/window';

	let { children } = $props();

	let isExpanded = $state(false);
	let showMobile = $state(false);
	let activePage = $state(page.url.pathname);

	// $: isSidebarOpen = innerWidth.current < 480 ? showMobile : isExpanded;

	let isSidebarOpen = $derived(
		innerWidth.current < 480 ? showMobile : isExpanded
	);

	const mainMenu = [
		{ name: 'Dashboard', href: '/admin', icon: 'heroicons:chart-bar-square' },
		{ name: 'Students', href: '/admin/students', icon: 'heroicons:user-group' },
		{ name: 'Users', href: '/admin/users', icon: 'heroicons:users' },
		{ name: 'Interested', href: '/admin/interested', icon: 'heroicons:user-plus' },
		{ name: 'Completed', href: '/admin/completed', icon: 'heroicons:check-badge' }
		// { name: 'Applications', href: '/admin/applications', icon: 'heroicons:calendar' },
		// { name: 'Visa Process', href: '/admin/visa-process', icon: 'heroicons:building-library' },
		// { name: 'Documents', href: '/admin/documents', icon: 'heroicons:document-duplicate' }
	];

	const otherMenu = [
		// { name: 'Support', href: "", icon: 'heroicons:headphones' },
		{ name: 'Settings', href: '/admin/settings', icon: 'heroicons:cog-6-tooth' }
	];

	function toggleSidebar() {
		if (innerWidth.current < 480) {
			showMobile = !showMobile;
		} else {
			isExpanded = !isExpanded;
		}
	}
</script>

{#if innerWidth.current < 480 && !showMobile}
	<button
		onclick={() => (showMobile = true)}
		class="fixed top-4 left-4 z-50 inline-flex items-center rounded-full bg-white p-3 shadow-lg/5">
		<Icon icon="heroicons:bars-3-20-solid" class="text-xl" />
	</button>
{/if}

<div class="fixed top-4 left-4 z-50">
	<aside
		class="{isExpanded ? 'w-48' : 'w-16'} {innerWidth.current < 480 ? (showMobile ? '' : 'hidden') : ''} h-[calc(100vh-2rem)] transform flex-col rounded-2xl border border-gray-200/50 bg-white text-gray-700 shadow-lg/5 transition-transform">
		<div class="my-5 flex items-center justify-center">
			{#if innerWidth.current >= 480 && isExpanded}
				<!-- <img src={logoFull} alt="Zinda Logo" class="mx-auto h-6" /> -->
				 <img src={favicon} alt="Zinda Logo" class="h-6 w-6" />
			{:else}
				<div class="flex h-6 w-6 items-center justify-center rounded">
					<img src={favicon} alt="Zinda Logo" class="h-6 w-6" />
				</div>
			{/if}
		</div>

		<nav class="flex w-full grow items-center justify-center border-t border-gray-200 pt-4">
			<ul class="flex w-full flex-col items-center justify-center space-y-2 p-2">
				{#each mainMenu as item}
					<li class="mb-2 flex w-full justify-center">
						<a
							href={item.href}
							class="inline-flex items-center rounded-lg {(innerWidth.current >= 480 && isExpanded)
								? 'w-full justify-start p-2'
								: 'w-10 justify-center p-2'} h-10 transition-colors {activePage === item.href
								? 'bg-primary/10 text-primary'
								: 'hover:bg-gray-100'}"
							class:hover:bg-gray-100={activePage !== item.href}>
							<Icon icon={item.icon} class="text-xl" />
							{#if innerWidth.current >= 480 && isExpanded}
								<span class="ml-3 text-sm font-medium tracking-tight text-gray-600"
									>{item.name}</span>
							{/if}
						</a>
					</li>
				{/each}
				<li class="mb-2 flex w-full justify-center">
					<button
						onclick={toggleSidebar}
						class="inline-flex items-center rounded-lg hover:bg-gray-100 {(innerWidth.current >= 480 && isExpanded)
							? 'w-full justify-start p-2'
							: 'w-10 justify-center p-2'} h-10 transition-colors">
						<Icon
							icon="heroicons:chevron-double-right-20-solid"
							class="text-xl transition-all duration-100 {isSidebarOpen
								? 'rotate-180'
								: 'rotate-0'} {(innerWidth.current >= 480 && isExpanded) ? 'mr-3' : ''}" />
						<span class="text-sm font-medium tracking-tight text-gray-600"
							>{innerWidth.current >= 480 && isExpanded ? 'Close' : ''}</span>
					</button>
				</li>
			</ul>
		</nav>

		<div class="flex items-center justify-center border-t border-gray-200/50 p-2">
			<button
				onclick={() => user.logout()}
				class="inline-flex items-center rounded-lg hover:bg-red-100 {(innerWidth.current >= 480 && isExpanded)
					? 'w-full justify-start p-2'
					: 'w-10 justify-center p-2'} h-10 transition-colors">
				<Icon
					icon="heroicons:arrow-left-start-on-rectangle-solid"
					class="text-xl text-red-800 transition-all duration-100 {(innerWidth.current >= 480 && isExpanded)
						? 'mr-3'
						: ''}" />
				<span class="text-sm font-medium tracking-tight text-red-800"
					>{innerWidth.current >= 480 && isExpanded ? 'Logout' : ''}</span>
			</button>
		</div>
	</aside>
</div>

<div
	class="p-6 transition-all duration-300 ease-in-out
		{innerWidth.current >= 480 && isExpanded ? 'ml-48' : ''}
		{innerWidth.current >= 480 && !isExpanded ? 'ml-16' : ''}
		{innerWidth.current < 480 ? 'ml-0' : ''}
		">
	{@render children?.()}
</div>