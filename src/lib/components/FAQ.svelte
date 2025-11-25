<script>
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';

	let openIndex = 0;

	const toggle = (index) => {
		openIndex = openIndex === index ? -1 : index;
	};

	const faqs = [
		{
			question: 'What documents are required for the visa?',
			answer:
				'You need a valid passport (6+ months validity), recent passport photos, vaccination certificates (Meningitis, COVID-19), and a confirmed travel package. We handle the entire visa application process for you.'
		},
		{
			question: 'When should I book my package?',
			answer:
				'We recommend booking 6-8 months in advance for Hajj due to limited government quotas. For Umrah, booking 2-3 months ahead is ideal to secure the best flight rates and proximity to the Haram.'
		},
		{
			question: 'What is included in the packages?',
			answer:
				'Our curated packages include round-trip flights, verified hotel accommodations near the Haram, private ground transportation, visa processing, guided Ziyarat tours, and 24/7 on-ground support.'
		},
		{
			question: 'Guidance for first-time pilgrims?',
			answer:
				'Absolutely. We offer comprehensive pre-departure seminars covering rituals, duas, health tips, and logistical expectations. Our team is available throughout your journey for any questions.'
		},
		{
			question: 'What health precautions should I take?',
			answer:
				'Mandatory vaccinations include Meningitis ACWY. We recommend being physically fit, packing necessary medications, and purchasing travel insurance. Our team provides a detailed health checklist.'
		},
		{
			question: 'Can I customize my travel package?',
			answer:
				'Yes. We offer customizable options for hotel star ratings, flight classes, group size, and additional nights. Contact our team to tailor your perfect spiritual journey.'
		},
		{
			question: 'What support is available on-ground?',
			answer:
				'Our dedicated team is available 24/7 in Makkah and Madinah. We provide on-ground assistance, guided tours, and emergency support throughout your stay.'
		},
		{
			question: 'Cancellation and refund policy?',
			answer:
				'Cancellation policies vary by package type. Generally, full refunds minus visa fees are available up to 60 days before departure. We offer flexible rebooking options for emergencies.'
		}
	];
</script>

<section class="w-full bg-white px-6 py-12 text-secondary antialiased md:px-12 md:py-16">
	<div class="mx-auto max-w-8xl">
		<div class="mb-16 border-b border-gray-100 pb-10 md:mb-20">
			<h1 class="mb-4 text-4xl font-medium tracking-tight text-black md:text-6xl">
				Your questions, <span class="text-primary">answered.</span>
			</h1>
			<p class="max-w-2xl text-lg leading-relaxed text-gray-500">
				We believe transparency is key to a spiritual journey. Here is how we handle the details so
				you don't have to.
			</p>
		</div>

		<div class="grid grid-cols-1 items-start gap-16 lg:grid-cols-12 lg:gap-24">
			<div class="order-last lg:sticky lg:top-24 lg:order-first lg:col-span-4">
				<span class="mb-5 block font-semibold tracking-widest text-primary uppercase">
					Key Information
				</span>

				<h2 class="mb-6 text-3xl font-medium tracking-tight text-black md:text-4xl">
					Support & <br /> Guidance.
				</h2>

				<p class="mb-10 text-base leading-relaxed text-gray-500">
					Specifics regarding visa processing, accommodation standards, and health requirements.
				</p>

				<div
					class="relative hidden overflow-hidden rounded-2xl bg-gray-950 p-6 text-white shadow-2xl shadow-black/10 md:p-8">
					<div
						class="pointer-events-none absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-primary/20 blur-xl">
					</div>

					<div class="relative z-10">
						<div class="mb-6 flex items-center justify-between">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white">
								<Icon icon="heroicons:phone" class="h-5 w-5" />
							</div>
							<div
								class="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/20 px-3 py-1">
								<div class="h-1.5 w-1.5 rounded-full bg-primary"></div>
								<span class="text-[10px] font-bold tracking-wider text-primary uppercase"
									>Online Now</span>
							</div>
						</div>

						<h3 class="mb-2 text-xl font-semibold tracking-tight">Hajj Concierge</h3>
						<p class="mb-6 text-sm leading-relaxed text-gray-400">
							Need a tailored itinerary for your family? Our specialists are ready to assist.
						</p>

						<a
							href="/contact"
							class="group flex w-full items-center justify-center gap-2 rounded-xl border border-white bg-white py-3 text-sm font-bold tracking-tight text-secondary
                                  shadow-none transition-all duration-200
                                  ease-out
                                  hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#00B77A]
                                  active:translate-x-0 active:translate-y-0 active:shadow-none">
							Book Consultation
						</a>
					</div>
				</div>
			</div>

			<div class="w-full lg:col-span-8">
				<div class="w-full border-t border-gray-100">
					{#each faqs as faq, i}
						<div
							class="border-b border-gray-100 p-1 px-4 transition-colors duration-300 {openIndex ===
							i
								? 'bg-gray-50/50'
								: 'bg-transparent'}">
							<button
								on:click={() => toggle(i)}
								class="group flex w-full items-start justify-between gap-4 py-5 text-left focus:outline-none md:py-6">
								<span
									class="w-full pr-4 text-sm leading-snug font-medium tracking-tight transition-colors duration-300 md:text-base {openIndex ===
									i
										? 'text-primary'
										: 'text-secondary'}">
									{faq.question}
								</span>

								<span
									class="relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center md:mt-1">
									<div
										class="transition-transform duration-300 {openIndex === i
											? 'rotate-45'
											: 'rotate-0'}">
										<Icon
											icon="heroicons:plus"
											class="h-5 w-5 transition-colors duration-300 {openIndex === i
												? 'text-primary'
												: 'text-gray-400 group-hover:text-gray-600'}" />
									</div>
								</span>
							</button>

							{#if openIndex === i}
								<div transition:slide={{ duration: 300, axis: 'y' }}>
									<p
										class="pr-4 pb-8 text-[15px] leading-relaxed text-gray-500 md:pr-16 md:text-base">
										{faq.answer}
									</p>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
