<script>
	import Button from '$components/ui/Button.svelte';
	import Icon from '@iconify/svelte';
</script>

<section class="w-full px-6 py-12 antialiased md:px-12">
	<div class="mx-auto max-w-8xl">
		<div
			class="relative flex w-full flex-col items-start justify-between gap-8 overflow-hidden rounded-3xl bg-linear-to-br from-gray-800 to-gray-950 p-6 text-white shadow-2xl shadow-black/5 md:flex-row md:items-end md:p-12">
			<div class="relative z-10 max-w-2xl">
				<h2 class="mb-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
					Ready to start your <br />
					<span class="text-primary">sacred journey?</span>
				</h2>
				<p class="max-w-md text-sm leading-relaxed text-gray-400 md:text-base">
					Your spiritual journey, simplified. We handle the logistics so you can focus on your
					worship.
				</p>
			</div>

			<Button
				href="/contact"
				text="Get in Touch"
				variant="primary"
				size="lg"
				class="relative z-10 shrink-0 bg-white text-black" />
		</div>
	</div>
</section>
