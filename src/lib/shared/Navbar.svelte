<script>
	import favicon from '$lib/assets/favicon.svg';

	import { onMount } from 'svelte';
	import { auth } from '$lib/auth.svelte.js';
	import { fade, slide } from 'svelte/transition';

	import Icon, { loadIcon } from '@iconify/svelte';
	import Button from '$components/ui/Button.svelte';

	let { sticky = true, floating = true } = $props();

	let isAuth = $derived(auth.isLoggedIn);
	let adminLoggedIn = $derived(auth.isAdmin);

	onMount(async () => {
		const icons = [
			'heroicons:home',
			'heroicons:cube',
			'heroicons:phone',
			'heroicons:arrow-right',
			'heroicons:bars-3-20-solid',
			'heroicons:x-mark-20-solid'
		];

		await Promise.all(icons.map((i) => loadIcon(i)));
	});

	let links = [
		{ name: 'Hijra Portal', href: '/hijra-portal', icon: 'heroicons:home', adminAccess: false },
		{
			name: 'Our Packages',
			href: '/packages',
			icon: 'heroicons:cube',
			adminAccess: true
		},
		{ name: 'About', href: '/about', icon: 'heroicons:cube', adminAccess: true },
		// { name: 'Available Courses', href: '/available-courses', icon: 'heroicons:document-duplicate' },
		{ name: 'Contact', href: '/contact', icon: 'heroicons:phone', adminAccess: false }
	];

	let isMobileMenuOpen = $state(false);

	function closeMenu() {
		isMobileMenuOpen = false;
	}
</script>

<nav
	class="{sticky
		? 'fixed inset-x-0 top-4 z-50'
		: 'relative z-10'} flex w-full items-center justify-center">
	<div
		class="mx-4 max-w-6xl sm:mx-6 lg:mx-8 {floating
			? 'rounded-full shadow-md/5'
			: ''} flex w-full items-center justify-between rounded-full bg-gray-50 px-4 py-3 md:bg-white">
		<a href="/" aria-label="Return to home" class="shrink-0">
			<div class="p-2">
				<img src={favicon} alt="Hijra" class="h-8 text-primary" />
				<!-- <img src={logoFull} alt="Hijra" class="hidden h-8 text-primary sm:block" /> -->
			</div>
			<!-- <div class="rounded-full bg-primary p-2 px-6 shadow-lg">
			</div> -->
		</a>

		<div class="mx-12 hidden w-full items-center justify-around space-x-2 md:flex">
			{#each links as link}
				<a
					href={link.href}
					class="rounded-full {adminLoggedIn && !link.adminAccess
						? 'hidden'
						: ''} px-3 py-2 text-sm text-gray-800 transition duration-200 hover:bg-gray-100 hover:text-primary">
					{link.name}
				</a>
			{/each}
		</div>

		<div class="ml-auto hidden items-center md:flex">
			{#if isAuth}
				{#if adminLoggedIn}
					<a
						href="/hijra-portal/profile"
						class="rounded-full bg-secondary px-6 py-3 text-white shadow-lg transition duration-150 hover:bg-primary">
						Admin
					</a>
				{:else}
					<a
						href="/hijra-portal/profile"
						class="rounded-full bg-secondary px-6 py-3 text-white shadow-lg transition duration-150 hover:bg-primary">
						Profile
					</a>
				{/if}
			{:else}

					<Button 
						href="/auth/"
						text="Login"
						icon="heroicons:arrow-right"
						class="rounded-full px-6 py-3"
					 />

			<!-- <a
					href="/auth/"
					class="group flex items-center rounded-full bg-secondary px-6 py-3 text-white shadow-lg transition duration-150 hover:bg-primary">
					Login
					<Icon
						icon="heroicons:arrow-right"
						class="ml-2 size-4 transition-all duration-150 group-hover:ml-4" />
				</a> -->
			{/if}
		</div>

		<div class="flex items-center md:hidden">
			<span class="text-sm font-medium text-gray-800">Hijra</span>
		</div>

		<button
			class="ml-4 rounded-full p-1 transition duration-200 hover:bg-gray-100 md:hidden"
			onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
			aria-label="Toggle menu"
			aria-expanded={isMobileMenuOpen}>
			<Icon
				icon={isMobileMenuOpen ? 'heroicons:x-mark-20-solid' : 'heroicons:bars-3-20-solid'}
				class="size-8 p-1" />
		</button>
	</div>
</nav>

{#if isMobileMenuOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-40 bg-gray-900/20"
		onclick={closeMenu}>
	</div>
	<div
		transition:slide={{ duration: 300, axis: 'y' }}
		class="fixed inset-x-0 top-28 z-50 mx-4 max-w-7xl rounded-3xl bg-white p-6 shadow-lg sm:mx-6 lg:mx-8">
		<div class="flex flex-col space-y-4">
			{#each links as link}
				<a
					href={link.href}
					onclick={closeMenu}
					class="py-2 text-xs font-medium text-gray-800 {adminLoggedIn && !link.adminAccess
						? 'hidden'
						: ''} hover:text-primary sm:text-sm">
					{link.name}
				</a>
			{/each}
			<div class="pt-2">
				{#if isAuth}
					{#if adminLoggedIn}
						<a
							href="/admin"
							onclick={closeMenu}
							class="block rounded-full bg-secondary px-4 py-3 text-center text-white shadow-lg">
							Admin
						</a>
					{:else}
						<a
							href="/hijra-portal/profile"
							onclick={closeMenu}
							class="block rounded-full bg-secondary px-4 py-3 text-center text-white shadow-lg">
							Profile
						</a>
					{/if}
				{:else}
					<a
						href="/auth/"
						onclick={closeMenu}
						class="group flex items-center justify-center rounded-full bg-secondary px-4 py-3 text-center text-white shadow-lg">
						Login
						<Icon
							icon="heroicons:arrow-right"
							class="ml-2 size-5 transition duration-150 group-hover:ml-4" />
					</a>
				{/if}
			</div>
		</div>
	</div>
{/if}
