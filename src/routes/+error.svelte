<script>
	import { Button } from '$components';
	import { onMount } from 'svelte';
</script>

<svelte:head>
	<title>Oops! Page Not Found</title>
	<meta name="description" content="Oops! Page Not Found" />
</svelte:head>

<div
	class="relative flex min-h-[50vh] w-full flex-col items-center justify-center overflow-hidden bg-white px-6 text-center text-secondary selection:bg-primary selection:text-white">
	<div
		class="absolute inset-0 opacity-[0.5]"
		style="background-image: radial-gradient(#E5E5E5 1px, transparent 1px); background-size: 32px 32px;">
	</div>

	<main class="relative z-10 flex w-full max-w-3xl flex-col items-center py-16 md:py-24">
		<div
			class="animate-fade-in-up mb-8 inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-2.5 opacity-0">
			<div class="flex items-center gap-2">
				<div class="h-1.5 w-1.5 rounded-full bg-primary"></div>
				<span class="text-sm font-bold tracking-wide text-secondary uppercase"
					><span class="text-gray-600">Error</span> 404</span>
			</div>
		</div>

		<h1
			class="animate-fade-in-up mb-8 text-5xl leading-tight text-secondary opacity-0 delay-100 md:text-7xl lg:text-8xl">
			<span class="block font-normal tracking-tight"> This path is </span>
			<span class="-mt-2 block font-light tracking-tighter text-primary md:-mt-4">
				uncharted.
			</span>
		</h1>

		<p
			class="animate-fade-in-up mx-auto mb-10 max-w-xl text-lg leading-relaxed font-normal text-gray-500 opacity-0 delay-200">
			The page you are looking for might have been moved or no longer exists. Let's guide you back
			to a familiar journey.
		</p>

		<div
			class="animate-fade-in-up flex w-full flex-col items-center justify-center gap-4 opacity-0 delay-300 sm:w-auto sm:flex-row">
			<!-- <Button href="/" text="Return Home" size="sm" />
			<Button href="/packages" text="View Packages" variant="secondary" size="sm" /> -->
			<Button text="Return Home" size="sm" />
			<Button text="View Packages" variant="secondary" size="sm" />
		</div>
	</main>
</div>

<style>
	.animate-fade-in-up {
		animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.delay-100 {
		animation-delay: 0.1s;
	}
	.delay-200 {
		animation-delay: 0.2s;
	}
	.delay-300 {
		animation-delay: 0.3s;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
