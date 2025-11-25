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
			url: '/hijrah-portal/packages',
			icon: 'ph:package',
			visible: true,
			image:
				'https://images.unsplash.com/photo-1568219557405-376e23e4f7cf?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Application Form',
			description: 'Fill out and submit your application form.',
			url: '/hijrah-portal/application',
			icon: 'ph:users-four',
			visible: true,
			image:
				'https://images.unsplash.com/photo-1589827577276-65d717348780?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Document Upload',
			description: 'Upload and manage your necessary documents.',
			url: '/hijrah-portal/document-upload',
			icon: 'ph:files',
			visible: true,
			image:
				'https://images.unsplash.com/photo-1564846824194-346b7871b855?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Payment',
			description: 'View payment details and upload payment receipts.',
			url: '/hijrah-portal/payment',
			icon: 'ph:credit-card',
			visible: false,
			image:
				'https://images.unsplash.com/photo-1628527304948-06157ee3c8a6?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Journey Dates & Departure',
			description: 'Check your travel dates and departure information.',
			url: '/hijrah-portal/journey-details',
			icon: 'ph:calendar-check',
			visible: false,
			image:
				'https://images.unsplash.com/photo-1649298173603-9c95aa950879?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Pilgrim Tracking',
			description: 'Track your pilgrimage journey in real-time.',
			url: '/hijrah-portal/pilgrim-tracking',
			icon: 'ph:clipboard-text',
			visible: false,
			image:
				'https://images.unsplash.com/photo-1587573088697-b4fa10460683?&auto=format&fit=crop&q=80&w=1170'
		}
	]);

	// const steps = [{}];

	const steps = $derived(
		cards.map((card, i) => ({
			text: card.text,
			completed: i < cards.findIndex((c) => c.visible) // Adjust: completed before current visible
		}))
	);
</script>

<section class="min-h-screen bg-white text-secondary">
	{#if auth?.user}
		<div class="mx-auto max-w-8xl px-6 pt-12 md:px-12 md:pt-16">
			<div class="my-4 md:my-8">
				<span class="mb-4 block text-xs font-bold tracking-widest text-primary uppercase">
					Hijrah Portal
				</span>
				{#if auth?.user?.name}
					<h1 class="text-4xl font-medium tracking-tighter text-secondary md:text-5xl">
						Welcome back, <br />
						<span class="text-primary">{auth.user.name}.</span>
					</h1>
					<p class="mt-4 w-fit rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-500">
						{auth.user.email}
					</p>
				{:else}
					<p class="text-lg text-gray-500">Loading your details...</p>
				{/if}
			</div>
		</div>
	{/if}

	<Timeline {cards} />

	<div class="mx-auto max-w-8xl px-6 pb-12 md:px-12 md:pb-16">
		<div class="mb-10">
			<h2 class="text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
				Your Journey <span class="text-primary">Modules</span>
			</h2>
			<p class="mt-3 text-gray-500">
				Access your personalized resources and complete each step of your sacred journey.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
			{#each cards as card (card.url)}
				<Card {card} />
			{/each}
		</div>
	</div>
</section>
