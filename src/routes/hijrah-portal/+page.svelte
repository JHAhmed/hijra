<script>
	import Card from '$components/portal/Card.svelte';
	import Icon from '@iconify/svelte';
	import Timeline from '$components/portal/Timeline.svelte';
	import Progress from '$components/portal/Progress.svelte';
	import Modal from '$components/ui/Modal.svelte';
	import { authStore } from '$lib/auth.svelte';
	import { onMount } from 'svelte';

	let isLoading = $state(true);
	let userProgress = $state(null);
	let applicationId = $state(null);
	let pilgrimComments = $state(null);

	// Base cards configuration - visibility will be updated based on progress
	let cards = $state([
		{
			text: 'Our Packages',
			description: 'Browse and select your preferred Hajj or Umrah package.',
			url: '/hijrah-portal/packages',
			icon: 'ph:package',
			step: 1,
			visible: true,
			completed: false,
			image:
				'https://images.unsplash.com/photo-1568219557405-376e23e4f7cf?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Application Form',
			description: 'Fill out and submit your application form.',
			url: '/hijrah-portal/application',
			icon: 'ph:users-four',
			step: 2,
			visible: false,
			completed: false,
			image:
				'https://images.unsplash.com/photo-1589827577276-65d717348780?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Document Upload',
			description: 'Upload and manage your necessary documents.',
			url: '/hijrah-portal/documents',
			icon: 'ph:files',
			step: 3,
			visible: false,
			completed: false,
			image:
				'https://images.unsplash.com/photo-1564846824194-346b7871b855?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Payment',
			description: 'View payment details and upload payment receipts.',
			url: '/hijrah-portal/payment',
			icon: 'ph:credit-card',
			step: 4,
			visible: false,
			completed: false,
			image:
				'https://images.unsplash.com/photo-1628527304948-06157ee3c8a6?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Journey Dates & Departure',
			description: 'Check your travel dates and departure information.',
			url: '/hijrah-portal/journey-details',
			icon: 'ph:calendar-check',
			step: 5,
			visible: false,
			completed: false,
			image:
				'https://images.unsplash.com/photo-1649298173603-9c95aa950879?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Pilgrim Tracking',
			description: 'Track your pilgrimage journey in real-time.',
			url: '/hijrah-portal/pilgrim-tracking',
			icon: 'ph:clipboard-text',
			step: 5,
			visible: false,
			completed: false,
			image:
				'https://images.unsplash.com/photo-1587573088697-b4fa10460683?&auto=format&fit=crop&q=80&w=1170'
		},
		{
			text: 'Pilgrim Information',
			description: 'View and manage your pilgrimage information.',
			url: '/hijrah-portal/pilgrim-information',
			icon: 'ph:clipboard-text',
			step: 5,
			visible: false,
			completed: false,
			image:
				'https://images.unsplash.com/photo-1667391405747-bb437b3c7547?q=80&w=1074&auto=format&fit=crop'
		}
	]);

	// Update card visibility based on user's current step
	function updateCardsVisibility(currentStep) {
		cards = cards.map((card) => ({
			...card,
			visible: card.step <= currentStep,
			completed: card.step < currentStep
		}));
	}

	// Fetch user progress on mount
	onMount(async () => {
		if (!authStore.user) {
			isLoading = false;
			return;
		}

		try {
			const response = await fetch(`/api/user/progress?userId=${authStore.user.$id}`);
			const data = await response.json();

			if (data.success) {
				userProgress = data;
				applicationId = data.applicationId;
				pilgrimComments = data.pilgrimComments || null;
				console.log(data);
				// Update cards based on current step
				// Step 0 = no application, show only packages
				// Step 1 = package selected, show packages + application
				// Step 2 = application submitted, show up to documents
				// Step 3+ = further steps unlocked
				const stepToShow = data.hasApplication ? data.currentStep + 1 : 1;
				updateCardsVisibility(stepToShow);
			}
		} catch (error) {
			console.error('Failed to fetch user progress:', error);
		} finally {
			isLoading = false;
		}
	});

	// Update application URL with applicationId if available
	$effect(() => {
		if (applicationId) {
			const appCard = cards.find((c) => c.text === 'Application Form');
			const docsCard = cards.find((c) => c.text === 'Document Upload');

			if (appCard && !appCard.url.includes('applicationId')) {
				appCard.url = `/hijrah-portal/application?applicationId=${applicationId}`;
			}
			if (docsCard && !docsCard.url.includes('applicationId')) {
				docsCard.url = `/hijrah-portal/documents?applicationId=${applicationId}`;
			}
		}
	});
</script>

<svelte:head>
	<title>Travel Portal | Hijrah Portal</title>
	<meta
		name="description"
		content="Plan your Hajj and Umrah journey with ease. Book your package now!" />
</svelte:head>

<section class="min-h-screen bg-white text-secondary">
	{#if authStore?.user}
		<div class="mx-auto max-w-8xl px-6 pt-12 md:px-12 md:pt-16">
			<div class="my-4 md:my-8">
				<span class="mb-4 block text-xs font-bold tracking-widest text-primary uppercase">
					Hijrah Portal
				</span>
				{#if authStore?.user?.name}
					<h1 class="text-4xl font-medium tracking-tighter text-secondary md:text-5xl">
						Welcome back, <br />
						<span class="text-primary">{authStore.user.name}.</span>
					</h1>
					<p class="mt-4 w-fit rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-500">
						{authStore.user.email}
					</p>
					{#if pilgrimComments}
						<div class="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
							<div class="flex items-start gap-3">
								<Icon icon="ph:note" class="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
								<div>
									<p class="text-xs font-bold tracking-wider text-amber-700 uppercase">Note from Admin</p>
									<p class="mt-1 text-sm text-amber-800">{pilgrimComments}</p>
								</div>
							</div>
						</div>
					{/if}
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
