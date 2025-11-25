<script>
	import { onMount } from 'svelte';
	import makkahSkyline from '$lib/assets/images/makkah-skyline.jpg';
	import islamicBuilding from '$lib/assets/images/islamic-building.jpg';
	import masjidEntrance from '$lib/assets/images/masjid-entrance.jpg';
	import minar from '$lib/assets/images/minar.jpg';
	import CTA from '$shared/CTA.svelte';
	onMount();

	const team = [
		{ name: 'Sheikh Abdullah', role: 'Head of Guidance' },
		{ name: 'Yusuf Rahman', role: 'Operations Director' },
		{ name: 'Fatima Zahra', role: 'Pilgrim Experience' },
		{ name: 'Omar Farooq', role: 'Logistics Lead' }
	];

	const principles = [
		{
			title: 'Amanah',
			label: 'Trust',
			desc: 'Your journey is a sacred trust. We honor it with transparency and unwavering reliability.',
			img: islamicBuilding
		},
		{
			title: 'Ihsan',
			label: 'Excellence',
			desc: 'Perfection in every detail. From the logistics of your flight to the quality of your stay.',
			img: masjidEntrance
		},
		{
			title: 'Khidmah',
			label: 'Service',
			desc: 'Serving the guests of Ar-Rahman is not a job; it is the highest honor we cherish.',
			img: makkahSkyline
		},
		{
			title: 'Ilm',
			label: 'Knowledge',
			desc: 'Authentic scholarship ensures every ritual of your Manasik is performed correctly.',
			img: minar
		}
	];
</script>

<svelte:head>
	<title>About Us | hijrah</title>
	<meta
		name="description"
		content="Learn more about hijrah, our mission, and the services we offer to pilgrims." />
	<meta
		name="keywords"
		content="Hajj packages, Umrah packages, Hajj from India, Umrah from Chennai, affordable Hajj packages, Makkah hotel booking, Madinah hotel booking, pilgrimage services, Hajj visa, Umrah visa" />
	<link rel="canonical" href="https://hijrah-portal.vercel.app/about" />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "TravelAgency",
			"name": "About | hijrah",
			"description": "Learn more about hijrah, our mission, and the services we offer to pilgrims.",
			"areaServed": ["Saudi Arabia", "India", "UAE", "Malaysia", "United Kingdom"],
			"serviceType": ["Hajj Packages", "Umrah Packages", "Islamic Tours", "Pilgrimage Services"],
			"url": "https://hijrah-portal.vercel.app/about"
		}
	</script>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="About | hijrah" />
	<!-- <meta property="og:image" content="{page.url.origin}/ogimage.png" /> -->
	<!-- <meta property="og:url" content="{page.url.origin}/about" /> -->
	<meta
		property="og:description"
		content="Learn more about hijrah, our mission, and the services we offer to pilgrims." />
</svelte:head>

<section class="w-full bg-white px-6 pt-24 pb-12 text-secondary md:px-12">
	<div class="mx-auto max-w-[1000px] text-center">
		<div class="animate-fade-in-up mb-6 flex translate-y-4 justify-center opacity-0">
			<span
				class="rounded-full border border-gray-100 bg-gray-50 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
				About Us
			</span>
		</div>

		<h1
			class="animate-fade-in-up mb-8 translate-y-4 text-5xl leading-[1.1] font-semibold tracking-tighter text-secondary opacity-0 delay-100 md:text-7xl">
			Bridging the <br class="hidden md:block" />
			<span class="text-primary">distance.</span>
		</h1>

		<p
			class="animate-fade-in-up mx-auto max-w-2xl translate-y-4 text-lg leading-relaxed font-medium text-gray-500 opacity-0 delay-200 md:text-xl">
			We exist to remove the worldly obstacles between you and the Sacred House. Founded on trust,
			delivered with excellence.
		</p>
	</div>
</section>

<section class="w-full border-b border-gray-100 bg-white px-6 pt-16 pb-20 text-secondary md:px-12">
	<div class="mx-auto max-w-8xl">
		<div class="mb-20 grid grid-cols-1 items-end gap-12 lg:grid-cols-2 lg:gap-20">
			<div>
				<h1 class="text-5xl leading-none font-semibold tracking-tighter text-secondary md:text-7xl">
					Serving the <br />
					<span class="text-primary">Guests of Allah.</span>
				</h1>
			</div>

			<div class="lg:pb-2">
				<p class="text-lg leading-relaxed font-medium text-gray-500 md:text-xl">
					We bridge the gap between your intention and the Sacred House. Founded on trust, delivered
					with excellence since 2010.
				</p>
			</div>
		</div>

		<div class="group relative h-[400px] w-full overflow-hidden rounded-2xl md:h-[550px]">
			<img
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
				Guiding <span class="text-primary">Principles.</span>
			</h2>

			<div class="pb-1">
				<p
					class="max-w-sm text-left text-lg leading-relaxed font-medium text-gray-500 md:text-right md:text-xl">
					The four pillars that define our service and uphold every journey we craft.
				</p>
			</div>
		</div>

		<div class="grid h-auto grid-cols-1 gap-6 md:h-[900px] md:grid-cols-2">
			{#each principles as item}
				<div
					class="group relative h-[500px] w-full overflow-hidden rounded-3xl bg-gray-100 md:h-full">
					<img
						src={item.img}
						alt={item.title}
						class="h-full w-full object-cover transition-transform duration-1000 ease-out will-change-transform" />

					<div
						class="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80 opacity-80 transition-opacity duration-500 group-hover:opacity-90">
					</div>

					<div class="absolute top-0 left-0 p-10 md:p-12">
						<span
							class="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-md">
							{item.label}
						</span>
					</div>

					<div class="absolute bottom-0 left-0 w-full max-w-xl p-10 md:p-12">
						<h3 class="mb-4 text-5xl font-bold tracking-tight text-white md:text-6xl">
							{item.title}
						</h3>
						<p class="text-base leading-relaxed font-medium text-gray-200 opacity-90 md:text-lg">
							{item.desc}
						</p>
						<div class="mt-6 h-1 w-12 bg-primary"></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="w-full bg-white px-6 py-24 text-secondary md:px-12">
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
</section>

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
