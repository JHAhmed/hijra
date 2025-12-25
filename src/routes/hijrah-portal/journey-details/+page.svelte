<script>
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';
	import Button from '$components/ui/Button.svelte';

	// Hardcoded Journey Data
	const journeyData = {
		departureDate: '2026-06-10',
		returnDate: '2026-06-25',
		duration: '15 Days',
		packageType: 'Premium Hajj Package',
		groupSize: '50 Pilgrims',
		status: 'Confirmed'
	};

	const flights = [
		{
			type: 'Outbound',
			airline: 'Saudi Airlines',
			flightNumber: 'SV 752',
			from: 'Indira Gandhi International Airport (DEL)',
			to: 'King Abdulaziz International Airport (JED)',
			departure: {
				date: '2026-06-10',
				time: '02:30 AM',
				terminal: 'Terminal 3'
			},
			arrival: {
				date: '2026-06-10',
				time: '06:45 AM',
				terminal: 'Terminal 1'
			},
			duration: '5h 45m',
			class: 'Economy',
			baggage: '2 x 23kg + 7kg Cabin'
		},
		{
			type: 'Return',
			airline: 'Saudi Airlines',
			flightNumber: 'SV 753',
			from: 'King Abdulaziz International Airport (JED)',
			to: 'Indira Gandhi International Airport (DEL)',
			departure: {
				date: '2026-06-25',
				time: '10:30 PM',
				terminal: 'Terminal 1'
			},
			arrival: {
				date: '2026-06-26',
				time: '05:15 AM',
				terminal: 'Terminal 3'
			},
			duration: '5h 15m',
			class: 'Economy',
			baggage: '2 x 23kg + 7kg Cabin'
		}
	];

	const accommodations = [
		{
			city: 'Makkah',
			hotel: 'Hilton Suites Makkah',
			rating: 5,
			distance: '350m from Haram',
			checkIn: '2026-06-10',
			checkOut: '2026-06-19',
			nights: 9,
			roomType: 'Quad Sharing',
			amenities: ['Free WiFi', '24/7 Room Service', 'Prayer Facilities', 'Buffet Meals']
		},
		{
			city: 'Madinah',
			hotel: 'Madinah Hilton',
			rating: 5,
			distance: '200m from Masjid Nabawi',
			checkIn: '2026-06-19',
			checkOut: '2026-06-25',
			nights: 6,
			roomType: 'Quad Sharing',
			amenities: ['Free WiFi', '24/7 Room Service', 'Prayer Facilities', 'Buffet Meals']
		}
	];

	const itinerary = [
		{
			day: 'Day 1-9',
			title: 'Makkah al-Mukarramah',
			location: 'Holy City of Makkah',
			activities: [
				'Arrival & Hotel Check-in',
				'Umrah Performance',
				'Daily Prayers at Masjid al-Haram',
				'Hajj Rituals & Preparations',
				'Visit to Historical Sites',
				'Spiritual Lectures by Scholars'
			]
		},
		{
			day: 'Day 10-15',
			title: 'Madinah al-Munawwarah',
			location: 'City of the Prophet ﷺ',
			activities: [
				'Transfer to Madinah',
				'Prayers at Masjid Nabawi',
				'Ziyarat of Historical Sites',
				'Visit to Quba Mosque',
				'Visit to Qiblatain Mosque',
				'Visit to Uhud Mountain',
				'Farewell Gathering'
			]
		}
	];

	const importantInfo = [
		{
			icon: 'ph:passport',
			title: 'Travel Documents',
			items: [
				'Valid passport (min 6 months validity)',
				'Meningitis vaccine certificate',
				'Hajj visa (processed by us)',
				'Travel insurance documents'
			]
		},
		{
			icon: 'ph:suitcase',
			title: 'What to Pack',
			items: [
				'Ihram clothing (men)',
				'Modest clothing (women)',
				'Comfortable walking shoes',
				'Personal medications',
				'Prayer mat & Quran',
				'Reusable water bottle'
			]
		},
		{
			icon: 'ph:info',
			title: 'Important Notes',
			items: [
				'Arrive 3 hours before flight',
				'Keep valuables in cabin baggage',
				'Stay with group at all times',
				'Follow guide instructions',
				'Emergency contacts will be provided'
			]
		}
	];

	function formatDate(dateStr) {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Journey Details | Hijrah Portal</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 pt-10 pb-20 text-secondary">
	<div class="mx-auto max-w-6xl px-6">
		<!-- Header -->
		<div class="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
			<div>
				<span class="mb-3 block text-xs font-bold tracking-widest text-primary uppercase">
					Journey Information
				</span>
				<h1 class="text-3xl font-semibold tracking-tighter md:text-5xl">
					Your Sacred <span class="text-primary">Journey.</span>
				</h1>
				<p class="mt-4 max-w-xl text-lg text-gray-500">
					All the details you need for your blessed pilgrimage to the Holy Cities.
				</p>
			</div>

			<div
				class="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-700">
				<Icon icon="heroicons:check-circle-solid" class="h-4 w-4" />
				{journeyData.status}
			</div>
		</div>

		<!-- Journey Overview -->
		<div
			in:fade={{ delay: 50 }}
			class="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
			<div class="mb-6 flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
					<Icon icon="ph:airplane-takeoff-fill" class="h-5 w-5" />
				</div>
				<h2 class="text-xl font-bold text-secondary">Journey Overview</h2>
			</div>

			<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
				<div class="space-y-1">
					<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Package</p>
					<p class="text-lg font-medium text-secondary">{journeyData.packageType}</p>
				</div>
				<div class="space-y-1">
					<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Departure</p>
					<p class="text-lg font-medium text-secondary">{formatDate(journeyData.departureDate)}</p>
				</div>
				<div class="space-y-1">
					<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Return</p>
					<p class="text-lg font-medium text-secondary">{formatDate(journeyData.returnDate)}</p>
				</div>
				<div class="space-y-1">
					<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Duration</p>
					<p class="text-lg font-medium text-secondary">{journeyData.duration}</p>
				</div>
				<div class="space-y-1">
					<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Group Size</p>
					<p class="text-lg font-medium text-secondary">{journeyData.groupSize}</p>
				</div>
			</div>
		</div>

		<!-- Flight Details -->
		<div class="mb-8 space-y-6">
			{#each flights as flight, i}
				<div
					in:fade={{ delay: 100 + i * 50 }}
					class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
					<div
						class="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
						<div class="flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-400">
								{i + 1}
							</div>
							<div>
								<h3 class="text-lg font-bold text-secondary">{flight.type} Flight</h3>
								<p class="text-xs font-bold tracking-wider text-primary uppercase">
									{flight.airline} • {flight.flightNumber}
								</p>
							</div>
						</div>
						<span
							class="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 md:inline-block">
							{flight.duration}
						</span>
					</div>

					<div class="p-8">
						<!-- Flight Route -->
						<div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<!-- Departure -->
							<div class="flex-1">
								<p class="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
									Departure
								</p>
								<p class="mb-1 text-2xl font-bold tracking-tight text-secondary">
									{flight.departure.time}
								</p>
								<p class="text-sm font-medium text-gray-600">{formatDate(flight.departure.date)}</p>
								<p class="mt-3 text-sm text-gray-500">{flight.from}</p>
								<p class="text-xs text-gray-400">{flight.departure.terminal}</p>
							</div>

							<!-- Arrow -->
							<div class="hidden flex-shrink-0 text-gray-300 md:block">
								<Icon icon="ph:arrow-right-bold" class="h-6 w-6" />
							</div>

							<!-- Arrival -->
							<div class="flex-1 md:text-right">
								<p class="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">Arrival</p>
								<p class="mb-1 text-2xl font-bold tracking-tight text-secondary">
									{flight.arrival.time}
								</p>
								<p class="text-sm font-medium text-gray-600">{formatDate(flight.arrival.date)}</p>
								<p class="mt-3 text-sm text-gray-500">{flight.to}</p>
								<p class="text-xs text-gray-400">{flight.arrival.terminal}</p>
							</div>
						</div>

						<!-- Flight Details -->
						<div class="grid grid-cols-1 gap-4 rounded-2xl bg-gray-50 p-6 md:grid-cols-3">
							<div class="space-y-1">
								<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Class</p>
								<p class="text-base font-medium text-secondary">{flight.class}</p>
							</div>
							<div class="space-y-1">
								<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">
									Baggage Allowance
								</p>
								<p class="text-base font-medium text-secondary">{flight.baggage}</p>
							</div>
							<div class="space-y-1">
								<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">
									Flight Duration
								</p>
								<p class="text-base font-medium text-secondary">{flight.duration}</p>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Accommodations -->
		<div in:fade={{ delay: 200 }} class="mb-8">
			<div class="mb-6">
				<h2 class="mb-2 text-2xl font-bold tracking-tight text-secondary">Accommodations</h2>
				<p class="text-gray-500">Your stay in the Holy Cities</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each accommodations as hotel}
					<div class="overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
						<div class="mb-4 flex items-start justify-between">
							<div>
								<h3 class="mb-1 text-xl font-bold text-secondary">{hotel.hotel}</h3>
								<div class="mb-2 flex items-center gap-1">
									{#each Array(hotel.rating) as _}
										<Icon icon="ph:star-fill" class="h-4 w-4 text-primary" />
									{/each}
								</div>
								<div class="flex items-center gap-2 text-sm text-gray-500">
									<Icon icon="ph:map-pin" class="h-4 w-4" />
									<span>{hotel.distance}</span>
								</div>
							</div>
							<div class="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
								{hotel.city}
							</div>
						</div>

						<div class="my-4 border-t border-gray-100"></div>

						<div class="mb-4 grid grid-cols-2 gap-4">
							<div class="space-y-1">
								<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Check-in</p>
								<p class="text-sm font-medium text-secondary">{formatDate(hotel.checkIn)}</p>
							</div>
							<div class="space-y-1">
								<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Check-out</p>
								<p class="text-sm font-medium text-secondary">{formatDate(hotel.checkOut)}</p>
							</div>
							<div class="space-y-1">
								<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Duration</p>
								<p class="text-sm font-medium text-secondary">{hotel.nights} Nights</p>
							</div>
							<div class="space-y-1">
								<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Room Type</p>
								<p class="text-sm font-medium text-secondary">{hotel.roomType}</p>
							</div>
						</div>

						<div class="my-4 border-t border-gray-100"></div>

						<p class="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">Amenities</p>
						<div class="flex flex-wrap gap-2">
							{#each hotel.amenities as amenity}
								<span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
									{amenity}
								</span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Itinerary -->
		<div in:fade={{ delay: 250 }} class="mb-8">
			<div class="mb-6">
				<h2 class="mb-2 text-2xl font-bold tracking-tight text-secondary">Itinerary</h2>
				<p class="text-gray-500">Daily activities and spiritual journey</p>
			</div>

			<div class="space-y-6">
				{#each itinerary as day}
					<div class="overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
						<div class="mb-6 flex items-center gap-4">
							<div class="flex items-center gap-3">
								<div class="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
									{day.day}
								</div>
								<div>
									<h3 class="text-lg font-bold text-secondary">{day.title}</h3>
									<p class="flex items-center gap-1 text-sm text-gray-500">
										<Icon icon="ph:map-pin" class="h-4 w-4" />
										{day.location}
									</p>
								</div>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
							{#each day.activities as activity}
								<div class="flex items-start gap-2">
									<div class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></div>
									<p class="text-sm text-gray-600">{activity}</p>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Important Information -->
		<div in:fade={{ delay: 300 }} class="mb-8">
			<div class="mb-6">
				<h2 class="mb-2 text-2xl font-bold tracking-tight text-secondary">Important Information</h2>
				<p class="text-gray-500">Everything you need to know before departure</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				{#each importantInfo as info}
					<div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
						<div class="mb-4 flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Icon icon={info.icon} class="h-5 w-5" />
							</div>
							<h3 class="text-lg font-bold text-secondary">{info.title}</h3>
						</div>

						<ul class="space-y-2">
							{#each info.items as item}
								<li class="flex items-start gap-2 text-sm text-gray-600">
									<Icon
										icon="ph:check-circle-fill"
										class="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
									<span>{item}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<!-- Footer Actions -->
		<div class="mt-10 flex justify-between gap-4 border-t border-gray-200 pt-8">
			<Button href="/hijrah-portal" variant="secondary" size="md" text="Back to Portal" />
			<Button onclick={() => window.print()} variant="primary" size="md" text="Download PDF" />
		</div>
	</div>
</div>
