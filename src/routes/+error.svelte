<script>
	import { goto } from '$app/navigation';
	import Button from '$components/ui/Button.svelte';
</script>

<section
	class="flex min-h-[50vh] items-center justify-center bg-linear-to-r from-emerald-700 to-teal-700 py-16 sm:py-20">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<h2 class="text-3xl font-light text-white sm:text-4xl">This page does not exist.</h2>
		<p class="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
			The page you are looking for might have been removed, had its name changed, or is temporarily
			unavailable.
		</p>
		<div class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
			<Button
				href="/"
				text="Go Home"
				icon="ph:arrow-right-bold"
				class="bg-white text-emerald-700 hover:bg-emerald-50" />
			<Button
				href="/packages"
				text="Explore Packages"
				variant="pill"
				class="border-white/30 bg-transparent px-8 py-3 text-white hover:bg-white/10" />
		</div>
	</div>
</section>
