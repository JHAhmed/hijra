<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/auth.svelte';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { enhance } from '$app/forms';

	let { children } = $props();

	let isMobile = $state(false);
	let isExpanded = $state(false);
	let isMobileOpen = $state(false);

	onMount(() => {
		const checkWidth = () => {
			isMobile = window.innerWidth < 1024;
			if (!isMobile) isMobileOpen = false;
		};

		checkWidth();
		window.addEventListener('resize', checkWidth);
		return () => window.removeEventListener('resize', checkWidth);
	});

	const mainMenu = [
		{ name: 'Dashboard', href: '/admin', icon: 'heroicons:chart-bar-square' },
		{ name: 'Pilgrims', href: '/admin/pilgrims', icon: 'heroicons:user-group' },
		{ name: 'Tracking', href: '/admin/tracking', icon: 'heroicons:map-pin' }
		// { name: 'Interested', href: '/admin/interested', icon: 'heroicons:user-plus' },
		// { name: 'Completed', href: '/admin/completed', icon: 'heroicons:check-badge' }
	];

	const bottomMenu = [{ name: 'Settings', href: '/admin/settings', icon: 'heroicons:cog-6-tooth' }];

	function handleLogout() {
		authStore.logout();
		goto('/auth');
	}
</script>

{#if isMobile && isMobileOpen}
	<div
		role="button"
		tabindex="0"
		onclick={() => (isMobileOpen = false)}
		onkeydown={(e) => e.key === 'Escape' && (isMobileOpen = false)}
		class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300">
	</div>
{/if}

{#if isMobile && !isMobileOpen}
	<button
		onclick={() => (isMobileOpen = true)}
		class="fixed top-5 left-5 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-secondary shadow-md/5 transition-transform active:scale-95">
		<Icon icon="heroicons:bars-3-solid" class="h-6 w-6" />
	</button>
{/if}

<aside
	class="fixed top-0 left-0 z-50 flex h-screen flex-col overflow-hidden border-r border-gray-100 bg-white transition-all duration-300 ease-out
    {isMobile
		? isMobileOpen
			? 'w-64 translate-x-0 shadow-2xl'
			: 'w-64 -translate-x-full'
		: isExpanded
			? 'w-64'
			: 'w-20'}">
	<div class="relative flex h-20 shrink-0 items-center border-b border-gray-50">
		<div class="z-20 flex h-full w-20 shrink-0 items-center justify-center bg-white">
			<img src={favicon} alt="Logo" class="h-8 w-8 object-contain" />
		</div>

		<div
			class="absolute top-0 left-20 flex h-full items-center transition-opacity duration-300
            {isExpanded || (isMobile && isMobileOpen) ? 'opacity-100' : 'opacity-0'}">
			<span class="text-xl font-bold tracking-tight whitespace-nowrap text-secondary">
				Hijrah<span class="text-primary">.</span>
			</span>
		</div>

		{#if isMobile}
			<button
				onclick={() => (isMobileOpen = false)}
				class="absolute top-1/2 right-4 -translate-y-1/2 p-2 text-gray-400 hover:text-secondary">
				<Icon icon="heroicons:x-mark" class="h-6 w-6" />
			</button>
		{/if}
	</div>

	<nav
		class="flex-1 space-y-2 overflow-x-hidden overflow-y-auto px-3 py-6 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
		{#each mainMenu as item}
			{@const isActive = page.url.pathname === item.href}

			<a
				href={item.href}
				title={!isExpanded && !isMobile ? item.name : ''}
				class="group relative flex h-12 cursor-pointer items-center rounded-xl transition-colors duration-200 select-none
                {isActive ? 'bg-primary/5' : 'hover:bg-gray-50'}">
				<div class="flex min-w-64 items-center">
					<div class="flex w-14 shrink-0 items-center justify-center">
						<Icon
							icon={item.icon}
							class="h-5 w-5 transition-colors duration-200 {isActive
								? 'text-primary'
								: 'text-gray-600 group-hover:text-secondary'}" />
					</div>

					<span
						class="text-sm font-medium tracking-tight whitespace-nowrap transition-opacity duration-200
                        {isActive ? 'text-primary' : 'text-gray-500 group-hover:text-secondary'}
                        {isExpanded || (isMobile && isMobileOpen) ? 'opacity-100' : 'opacity-0'}">
						{item.name}
					</span>
				</div>
			</a>
		{/each}
	</nav>

	<div class="z-20 shrink-0 space-y-1 border-t border-gray-50 bg-white p-3">
		{#each bottomMenu as item}
			<a
				href={item.href}
				class="group relative flex h-12 cursor-pointer items-center overflow-hidden rounded-xl transition-colors duration-200 hover:bg-gray-50">
				<div class="flex min-w-64 items-center">
					<div class="flex w-14 shrink-0 items-center justify-center">
						<Icon
							icon={item.icon}
							class="h-5 w-5 text-gray-600 transition-colors group-hover:text-secondary" />
					</div>
					<span
						class="text-sm font-medium tracking-tight whitespace-nowrap text-gray-500 transition-opacity duration-200 group-hover:text-secondary
                        {isExpanded || (isMobile && isMobileOpen) ? 'opacity-100' : 'opacity-0'}">
						{item.name}
					</span>
				</div>
			</a>
		{/each}

		<form method="POST" action="?/logout" use:enhance>
			<!-- <Button type="submit" text="Sign out" class="w-full" /> -->

		<button
			type="submit"
			class="group relative flex h-12 w-full cursor-pointer items-center overflow-hidden rounded-xl transition-colors duration-200 hover:bg-red-50">
			<div class="flex min-w-64 items-center">
				<div class="flex w-14 shrink-0 items-center justify-center">
					<Icon
						icon="heroicons:arrow-left-start-on-rectangle-solid"
						class="h-5 w-5 text-gray-600 transition-colors group-hover:text-red-600" />
				</div>
				<span
					class="text-sm font-medium tracking-tight whitespace-nowrap text-gray-500 transition-opacity duration-200 group-hover:text-red-600
                    {isExpanded || (isMobile && isMobileOpen) ? 'opacity-100' : 'opacity-0'}">
					Logout
				</span>
			</div>
		</button>

		</form>


		{#if !isMobile}
			<div class="mt-2 border-t border-gray-50 pt-2">
				<button
					onclick={() => (isExpanded = !isExpanded)}
					class="group relative flex h-12 w-full cursor-pointer items-center overflow-hidden rounded-xl bg-white">
					<div class="flex min-w-64 items-center">
						<div class="flex w-14 shrink-0 items-center justify-center">
							<Icon
								icon={isExpanded
									? 'heroicons:chevron-double-left-20-solid'
									: 'heroicons:chevron-double-right-20-solid'}
								class="h-5 w-5 text-gray-400 transition-colors group-hover:text-primary" />
						</div>
						<span
							class="text-sm font-medium tracking-tight whitespace-nowrap text-gray-400 transition-opacity duration-200 group-hover:text-primary
                            {isExpanded ? 'opacity-100' : 'opacity-0'}">
							Collapse Sidebar
						</span>
					</div>
				</button>
			</div>
		{/if}
	</div>
</aside>

<div
	class="min-h-screen bg-white transition-all duration-300 ease-out
    {isMobile ? 'ml-0 pt-20' : isExpanded ? 'ml-64' : 'ml-20'}">
	{@render children?.()}
</div>
