<script>
	import { auth } from '$lib/auth.svelte';

    import Card from '$components/portal/Card.svelte';
	import Icon from '@iconify/svelte';
	import Timeline from '$components/portal/Timeline.svelte';
	import Progress from '$components/portal/Progress.svelte';

    let isLoading = $state(false);

	const cards = $state([
		{
			text: 'Our Packages',
			description: 'Browse and select your preferred Hajj or Umrah package.',
			url: '/hijra-portal/packages',
			icon: 'ph:package',
			visible: true,
			image:
				'https://images.unsplash.com/photo-1568219557405-376e23e4f7cf?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Application Form',
			description: 'Fill out and submit your application form.',
			url: '/hijra-portal/application',
			icon: 'ph:users-four',
			visible: true,
			image:
				'https://images.unsplash.com/photo-1589827577276-65d717348780?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Document Upload',
			description: 'Upload and manage your necessary documents.',
			url: '/hijra-portal/document-upload',
			icon: 'ph:files',
			visible: true,
			image:
				'https://images.unsplash.com/photo-1564846824194-346b7871b855?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Payment',
			description: 'View payment details and upload payment receipts.',
			url: '/hijra-portal/payment',
			icon: 'ph:credit-card',
			visible: false,
			image:
				'https://images.unsplash.com/photo-1628527304948-06157ee3c8a6?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Journey Dates & Departure',
			description: 'Check your travel dates and departure information.',
			url: '/hijra-portal/journey-details',
			icon: 'ph:calendar-check',
			visible: false,
			image:
				'https://images.unsplash.com/photo-1649298173603-9c95aa950879?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Pilgrim Tracking',
			description: 'Track your pilgrimage journey in real-time.',
			url: '/hijra-portal/pilgrim-tracking',
			icon: 'ph:clipboard-text',
			visible: false,
			image:
				'https://images.unsplash.com/photo-1587573088697-b4fa10460683?&auto=format&fit=crop&q=80&w=1170'
		}
	]);

	// const steps = [{}];

const steps = $derived(cards.map((card, i) => ({
		text: card.text,
		completed: i < cards.findIndex(c => c.visible) // Adjust: completed before current visible
	})));

</script>

<section>
	{#if auth?.user}
		<div class="mx-4 mb-4 rounded-2xl bg-gray-50 p-4 sm:p-6">
			<div class="flex flex-col items-center justify-center space-y-2 text-center sm:text-left">
				{#if auth?.user?.name}
					<p class="px-4 text-lg font-medium md:text-xl">{auth?.user?.name}</p>
					<p class="px-4 text-sm text-gray-600 md:text-base">{auth?.user?.email}</p>
				{:else}
					<p class="text-gray-600">Loading details...</p>
				{/if}
			</div>
		</div>
	{/if}

	<!-- <Progress /> -->
	<Timeline {cards} />

	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 md:grid-cols-2 xl:grid-cols-3">
		{#each cards as card (card.url)}
			<Card {card} />
		{/each}
	</div>
</section>
