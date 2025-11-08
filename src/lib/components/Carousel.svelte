<script>
	import { goto } from '$app/navigation';
	import Button from './ui/Button.svelte';
	import Autoplay from 'embla-carousel-autoplay';
	import Package from '$components/Package.svelte';
	import emblaCarouselSvelte from 'embla-carousel-svelte';

	let { unis } = $props();

	let options = {
		loop: true,
		align: 'start',
		skipSnaps: false,
		slidesToScroll: 1
	};

	let plugins = [Autoplay({ delay: 2000, stopOnInteraction: false })];
</script>

<div class="embla overflow-hidden" use:emblaCarouselSvelte={{ options, plugins }}>
	<div class="embla__container flex">
		{#each unis as { name, location, image }}
			<div
				class="embla__slide mx-2 w-[calc(100%-1rem)] min-w-0 flex-none sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]">
				<div class="flex h-full w-full flex-col rounded-xl bg-white p-2">
					<img src={image.url} alt="" class="mb-2 aspect-video rounded-xl" loading="lazy" />

					<div class="flex h-full flex-col p-4">
						<div class="mb-4">
							<p class="text-xl font-medium tracking-tight">{name}</p>
							<p class="tracking-tight text-gray-600">
								{location.split(',')[0]} | {location.split(',')[1]}
							</p>
							<!-- <p class="tracking-tight text-gray-600">{location}</p> -->
						</div>

						<div class="mt-auto flex flex-col space-y-4">
							<div class="w-full">
								<Button
									href="/hijra-portal"
									text="Apply Now"
									moveText={true}
									icon="heroicons:arrow-right" />
							</div>
							<div class="">
								<Button text="Learn More" href="/packages" variant="secondary" />
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
