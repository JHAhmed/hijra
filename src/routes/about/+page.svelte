<script>
	import makkahSkyline from '$lib/assets/images/makkah-skyline.jpg';
	import CTA from '$shared/CTA.svelte';

	const milestones = [
		{
			period: 'Before 2003 — In 1994',
			title: 'First Haj Group Tour',
			desc: 'We organised our very first Haj group tour under our earlier entity. Since then, we have organised Haj pilgrimage tours every year without fail.'
		},
		{
			period: 'March 2003',
			title: 'New Beginnings — Dolphin Air Services',
			desc: 'We transformed and formed a new entity with IATA accreditation. Dolphin Air Services P. Ltd. was born, adding Air Ticketing to our growing portfolio.'
		},
		{
			period: '2003 – 2009',
			title: 'Progressive Growth',
			desc: 'Overwhelming customer support drove our growth. Services expanded to Haj group tours, international & domestic air ticketing, and bulk group bookings.'
		},
		{
			period: 'December 2009',
			title: 'Transition to Haj Service Operator',
			desc: 'We received our first recognition from the Government of India as a Haj Service Operator. That same year, we organised our first Haj pilgrimage under the Dolphin Haj brand.'
		},
		{
			period: 'Since Then',
			title: 'Growing with Our Clients\' Trust',
			desc: 'We have continued organising Haj pilgrimages and numerous Umrah tours. Authorised by the Ministry of Hajj — one of the first Indian companies to hold this honour.'
		},
		{
			period: 'Today',
			title: 'Leading Hajj Organiser in Tamilnadu',
			desc: 'With 29 years of experience, we have served thousands of guests and are proud to be recognised as the leading Hajj travel agency in Tamilnadu.'
		}
	];
</script>

<svelte:head>
	<title>About Us | Hijrah Portal – Powered by Dolphin Haj</title>
	<meta
		name="description"
		content="Learn more about Dolphin Air Services (Dolphin Haj), with 29 years of experience as one of the leading Hajj & Umrah tour operators in Tamilnadu, India." />
	<meta
		name="keywords"
		content="Dolphin Haj, Hajj packages, Umrah packages, Hajj from Tamilnadu, Umrah from Trichy, affordable Hajj packages, Makkah hotel booking, Madinah hotel booking, pilgrimage services, Hajj visa, Umrah visa" />
	<link rel="canonical" href="https://hijrah-portal.vercel.app/about" />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "TravelAgency",
			"name": "About | Hijrah Portal",
			"description": "Learn more about Hijrah Portal, our mission, and the services we offer to pilgrims.",
			"areaServed": ["Saudi Arabia", "India", "UAE", "Malaysia", "United Kingdom"],
			"serviceType": ["Hajj Packages", "Umrah Packages", "Islamic Tours", "Pilgrimage Services"],
			"url": "https://hijrah-portal.vercel.app/about"
		}
	</script>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="About | Hijrah Portal" />
	<!-- <meta property="og:image" content="{page.url.origin}/ogimage.png" /> -->
	<!-- <meta property="og:url" content="{page.url.origin}/about" /> -->
	<meta
		property="og:description"
		content="Learn more about Hijrah Portal, our mission, and the services we offer to pilgrims." />
</svelte:head>

<section class="w-full bg-white px-6 pt-16 pb-12 text-secondary md:px-12">
	<div class="mx-auto max-w-[1000px] text-center">
		<div class="animate-fade-in-up mb-6 flex translate-y-4 justify-center opacity-0">
			<span
				class="rounded-full border border-gray-100 bg-gray-50 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
				About Us
			</span>
		</div>

		<h1
			class="animate-fade-in-up mb-8 translate-y-4 text-5xl leading-[1.1] font-semibold tracking-tighter text-secondary opacity-0 delay-100 md:text-7xl">
			29 Years of <br class="hidden md:block" />
			<span class="text-primary">Sacred Journeys.</span>
		</h1>

		<p
			class="animate-fade-in-up mx-auto max-w-2xl translate-y-4 text-lg leading-relaxed font-medium text-gray-500 opacity-0 delay-200 md:text-xl">
			Established in 1992, Dolphin Air Services is the first preference for those blessed enough to
			perform Hajj and Umrah with ease, luxury and comfort.
		</p>
	</div>
</section>

<section class="w-full border-b border-gray-100 bg-white px-6 pt-16 pb-20 text-secondary md:px-12">
	<div class="mx-auto max-w-8xl">
		<div class="mb-20 grid grid-cols-1 items-end gap-12 lg:grid-cols-2 lg:gap-20">
			<div>
				<h2 class="text-5xl leading-none font-semibold tracking-tighter text-secondary md:text-7xl">
					Serving the <br />
					<span class="text-primary">Guests of Allah.</span>
				</h2>
			</div>

			<div class="lg:pb-2">
				<p class="text-lg leading-relaxed font-medium text-gray-500 md:text-xl">
					With experience of 29 years in the industry, Dolphin Air Services has provided a wide
					variety of Hajj and Umrah travel packages. We have built a reputation as one of the best
					Hajj travel agencies in Tamilnadu. In 2009, we received our first government recognition
					as a Haj Service Operator, and have since organised Haj pilgrimage groups every year
					under the Dolphin Haj brand.
				</p>
				<p class="mt-4 text-lg leading-relaxed font-medium text-gray-500 md:text-xl">
					Incorporated as a private limited company in 2003, Dolphin Air Services P. Ltd. is
					authorized by the Ministry of Hajj — one of the first Indian companies to receive this
					honour. Our team of local and Saudi-based managers, coordinators and volunteers ensures
					every pilgrim performs their Hajj and Umrah with absolute peace of mind.
				</p>
			</div>
		</div>

		<div class="group relative h-[400px] w-full overflow-hidden rounded-2xl md:h-[550px]">
			<img
				loading="lazy"
				src={makkahSkyline}
				alt="Makkah Skyline"
				class="h-full w-full object-cover transition-transform duration-700 ease-out" />
		</div>
	</div>
</section>

<section class="w-full border-b border-gray-100 bg-white px-6 py-24 text-secondary md:px-12">
	<div class="mx-auto max-w-8xl">
		<div class="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
			<h2 class="text-5xl leading-none font-normal tracking-tight text-secondary md:text-7xl">
				Our <span class="text-primary">Journey.</span>
			</h2>

			<div class="pb-1">
				<p
					class="max-w-sm text-left text-lg leading-relaxed font-medium text-gray-500 md:text-right md:text-xl">
					Three decades of trust, growth and service to the Ummah.
				</p>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each milestones as milestone, i}
				<div
					class="group relative flex flex-col border-t border-gray-200 pt-8 transition-colors duration-500 hover:border-primary">
					<span
						class="mb-4 text-xs font-bold tracking-widest text-primary uppercase">{milestone.period}</span>
					<h3
						class="mb-3 text-xl font-bold tracking-tight text-secondary transition-transform duration-300 group-hover:translate-x-2">
						{milestone.title}
					</h3>
					<p class="text-sm leading-relaxed text-gray-500">{milestone.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- <section class="hidden w-full bg-white px-6 py-24 text-secondary md:px-12">
	<div class="mx-auto flex max-w-8xl flex-col gap-16 md:flex-row md:gap-32">
		<div class="md:w-1/3">
			<h2 class="mb-4 text-4xl font-semibold tracking-tighter">Leadership.</h2>
			<p class="text-lg text-gray-500">The experts ensuring your peace of mind.</p>
		</div>

		<div class="flex flex-col md:w-2/3">
			{#each team as member}
				<div
					class="group flex cursor-default items-center justify-between border-b border-gray-100 py-8 transition-colors hover:border-gray-200">
					<div
						class="flex items-center gap-4 transition-transform duration-300 group-hover:translate-x-4">
						<span
							class="h-2 w-2 scale-0 rounded-full bg-primary opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
						></span>
						<h3 class="text-2xl font-medium tracking-tight text-secondary md:text-3xl">
							{member.name}
						</h3>
					</div>

					<span
						class="text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors group-hover:text-primary md:text-sm">
						{member.role}
					</span>
				</div>
			{/each}
		</div>
	</div>
</section> -->

<CTA />

<style>
	.animate-fade-in-up {
		animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	.delay-100 {
		animation-delay: 0.1s;
	}
	.delay-200 {
		animation-delay: 0.2s;
	}
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
