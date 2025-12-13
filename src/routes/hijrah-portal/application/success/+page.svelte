<script>
	import Button from '$components/ui/Button.svelte';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';

	let visible = $state(false);

	onMount(() => {
		visible = true;
	});
</script>

<svelte:head>
	<title>Application Submitted | Hijrah Portal</title>
</svelte:head>

<section
	class="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 text-center">
	{#if visible}
		<div
			in:scale={{ duration: 1000, easing: elasticOut, start: 0.5 }}
			class="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-primary md:h-32 md:w-32">
			<Icon icon="ph:check-circle-fill" class="h-12 w-12 md:h-16 md:w-16" />
		</div>

		<div in:fade={{ delay: 300, duration: 800 }} class="max-w-lg">
			<span class="mb-4 block text-xs font-bold tracking-widest text-primary uppercase">
				Success
			</span>
			<h1 class="mb-6 text-4xl font-semibold tracking-tighter text-secondary md:text-5xl">
				Application <span class="text-primary">Received.</span>
			</h1>
			<p class="mb-10 text-lg leading-relaxed text-gray-500">
				Alhamdulillah, your application and documents have been successfully submitted. Our team
				will review your details and update your status shortly.
			</p>

			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<Button href="/hijrah-portal" text="Return to Dashboard" variant="primary" size="md" />
				<Button href="/" text="Back to Home" variant="ghost" size="md" />
			</div>
		</div>
	{/if}
</section>
