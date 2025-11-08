<script>
	import { Accordion } from 'bits-ui';
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';

	const items = [
		{
			value: 1,
			title: 'What documents are required for Hajj/Umrah visa?',
			content: 'You need a valid passport (6+ months), passport photos, vaccination certificates (Meningitis, COVID-19), and a confirmed travel package. We handle the visa application process for you.'
		},
		{
			value: 2,
			title: 'When should I book my Hajj package?',
			content: 'We recommend booking 6-8 months in advance for Hajj due to limited quotas. For Umrah, booking 2-3 months ahead is ideal for better flight and hotel availability.'
		},
		{
			value: 3,
			title: 'What is included in your travel packages?',
			content: 'Our packages include flights, verified hotel accommodations near Haram, ground transportation, visa processing, guided tours, and 24/7 support. Meals may be included based on the package tier.'
		},
		{
			value: 4,
			title: 'Do you provide guidance for first-time pilgrims?',
			content: 'Yes! We offer comprehensive pre-departure seminars covering rituals, duas, health tips, and what to expect. Our team is available for questions throughout your journey.'
		},
		{
			value: 5,
			title: 'What health precautions should I take?',
			content: 'Required vaccinations include Meningitis ACWY. We recommend being physically fit, packing necessary medications, and purchasing travel insurance. Our team provides a detailed health checklist.'
		},
		{
			value: 6,
			title: 'Can I customize my travel package?',
			content: 'Absolutely. We offer customizable options for hotel star ratings, flight classes, group size, and additional nights. Contact our team to tailor your perfect spiritual journey.'
		},
		{
			value: 7,
			title: 'What support is available during the pilgrimage?',
			content: 'Our dedicated team is available 24/7 in Makkah and Madinah. We provide on-ground assistance, guided tours, and emergency support throughout your stay.'
		},
		{
			value: 8,
			title: 'What is your cancellation and refund policy?',
			content: 'Cancellation policies vary by package type. Generally, full refunds minus visa fees are available up to 60 days before departure. We offer flexible rebooking options for emergencies.'
		}
	];
</script>

<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
	<div class="mb-12 text-center">
		<p class="text-sm font-medium tracking-widest text-emerald-700 uppercase">Frequently Asked Questions</p>
		<h2 class="mt-2 text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
			Everything You Need to <span class="font-medium">Know</span>
		</h2>
	</div>

	<Accordion.Root class="space-y-4" type="multiple">
		{#each items as item (item.value)}
			<Accordion.Item
				value={item.value}
				class="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md"
			>
				<Accordion.Header>
					<Accordion.Trigger
						class="flex w-full items-center justify-between p-5 text-left hover:bg-gray-50 [&[data-state=open]>span>svg]:rotate-45" 
					>
						<span class="text-base font-medium text-gray-900">{item.title}</span>
						<span
							class="ml-4 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 transition-colors group-hover:bg-emerald-100"
						>
							<Icon icon="heroicons:plus" class="h-5 w-5 text-emerald-700 transition-transform duration-200 [.group[data-state=open]_&]:rotate-45" />
						</span>
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Content forceMount={true} class="overflow-hidden">
					{#snippet child({ props, open })}
						{#if open}
							<div {...props} transition:slide={{ duration: 250 }}>
								<div class="p-6">
									<p class="text-sm leading-relaxed text-gray-600">
										{item.content}
									</p>
								</div>
							</div>
						{/if}
					{/snippet}
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
</div>