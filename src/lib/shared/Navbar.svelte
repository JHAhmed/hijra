<script>
	import Icon from '@iconify/svelte';
	import logo from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import Button from '$components/ui/Button.svelte';
	import { auth } from '$lib/auth.svelte';

	let isScrolled = false;
	let isMobileMenuOpen = false;

	const toggleMobileMenu = () => (isMobileMenuOpen = !isMobileMenuOpen);

	const navLinks = [
		// { label: 'Home', href: '/' },
		{ label: 'About', href: '/about' },
		{ label: 'Packages', href: '/packages' },
		{ label: 'Contact', href: '/contact' }
	];

	// onMount(() => {
	// 	const handleScroll = () => {
	// 		isScrolled = window.scrollY > 10;
	// 	};
	// 	window.addEventListener('scroll', handleScroll);
	// 	return () => window.removeEventListener('scroll', handleScroll);
	// });
</script>

<nav
	class="fixed top-0 left-0 z-50 h-20 w-full border-b border-gray-100 bg-white antialiased transition-all duration-200">
	<!-- <div
		class="pointer-events-none absolute inset-0 h-full w-full border-b border-gray-100/0 transition-all duration-200 ease-out
    {isScrolled ? 'border-gray-100! bg-white opacity-100!' : 'opacity-0'}">
	</div> -->

	<div class="relative mx-auto flex h-full max-w-8xl items-center justify-between px-6 md:px-12">
		<a href="/" class="group relative z-50 flex shrink-0 items-center gap-3 select-none">
			<img src={logo} alt="Hijrah Logo" class="h-9 w-9 object-contain" />
			<span class="text-2xl font-bold tracking-tighter text-secondary">
				Hijrah<span class="text-primary">.</span>
			</span>
		</a>

		<div
			class="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="relative rounded-full px-5 py-2 font-medium text-gray-500 transition-all duration-200 hover:bg-gray-50/50 hover:text-secondary">
					{link.label}
				</a>
			{/each}
		</div>

		<div class="relative z-50 flex shrink-0 items-center gap-6">
			{#if !auth.isLoggedIn}
				<Button
					href="/auth"
					text="Log In"
					variant="secondary"
					size="md"
					class="hidden sm:inline-block" />

				<Button
					href="/contact"
					text="Get Started"
					variant="primary"
					size="md"
					class="hidden sm:inline-block" />
			{:else}
				<Button
					href="/profile"
					text="Profile"
					variant="secondary"
					size="md"
					class="hidden sm:inline-block" />

				<Button
					href="/hijrah-portal"
					text="Portal"
					variant="primary"
					size="md"
					class="hidden sm:inline-block" />
			{/if}

			<button
				on:click={toggleMobileMenu}
				class="relative z-60 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
				aria-label="Menu">
				<span
					class="h-0.5 w-6 rounded-full bg-black transition-all duration-300 {isMobileMenuOpen
						? 'translate-y-2 rotate-45'
						: ''}"></span>
				<span
					class="h-0.5 w-6 rounded-full bg-black transition-all duration-300 {isMobileMenuOpen
						? 'opacity-0'
						: 'opacity-100'}"></span>
				<span
					class="h-0.5 w-6 rounded-full bg-black transition-all duration-300 {isMobileMenuOpen
						? '-translate-y-2 -rotate-45'
						: ''}"></span>
			</button>
		</div>
	</div>

	{#if isMobileMenuOpen}
		<div
			class="animate-fade-in fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto bg-white pt-24 pb-10 md:hidden">
			<div class="flex w-full flex-col gap-8 px-6 text-center">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-3xl font-medium tracking-tight text-secondary transition-colors hover:text-primary"
						on:click={toggleMobileMenu}>
						{link.label}
					</a>
				{/each}

				<div class="mx-auto my-4 h-px w-16 bg-gray-100"></div>

				{#if !auth.isLoggedIn}
					<a
						href="/login"
						class="text-xl font-medium text-gray-500 transition-colors hover:text-black"
						on:click={toggleMobileMenu}>
						Log In
					</a>

					<a href="/contact" class="text-xl font-bold text-primary" on:click={toggleMobileMenu}>
						Get Started
					</a>
				{:else}
					<a
						href="/profile"
						class="text-xl font-medium text-gray-500 transition-colors hover:text-black"
						on:click={toggleMobileMenu}>
						Profile
					</a>

					<a
						href="/hijrah-portal"
						class="text-xl font-bold text-primary"
						on:click={toggleMobileMenu}>
						Portal
					</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>

<style>
	.animate-fade-in {
		animation: fadeIn 0.2s ease-out forwards;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
