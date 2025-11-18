<script>
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import { Button } from '$components';
	import { goto } from '$app/navigation';

	const stats = [
		{ value: '15', suffix: '+', label: 'Years of Excellence' },
		{ value: '5000', suffix: '+', label: 'Pilgrims Served' },
		{ value: '100', suffix: '%', label: 'Satisfaction Rate' },
		{ value: '5', suffix: '', label: 'Countries Served' }
	];

	const values = [
		{
			icon: 'heroicons:heart',
			title: 'Compassionate Service',
			description:
				'We treat every pilgrim with care, respect, and understanding throughout their sacred journey.'
		},
		{
			icon: 'heroicons:shield-check',
			title: 'Trust & Transparency',
			description:
				'Complete transparency in pricing, processes, and communication at every step of your pilgrimage.'
		},
		{
			icon: 'heroicons:sparkles',
			title: 'Excellence in Detail',
			description:
				'Meticulous attention to every detail ensures a seamless and spiritually fulfilling experience.'
		},
		{
			icon: 'heroicons:users',
			title: 'Expert Guidance',
			description:
				'Our certified advisors provide knowledgeable support from consultation to completion.'
		},
		{
			icon: 'heroicons:clock',
			title: '24/7 Support',
			description:
				'Round-the-clock assistance ensures peace of mind throughout your entire journey.'
		},
		{
			icon: 'heroicons:globe-asia-australia',
			title: 'Global Network',
			description:
				'Strong partnerships with hotels, airlines, and local guides across Saudi Arabia.'
		}
	];
	const services = [
		{
			icon: 'heroicons:document-check',
			title: 'Visa Processing',
			description: 'Complete visa assistance with document verification and submission tracking.'
		},
		{
			icon: 'heroicons:building-office',
			title: 'Premium Accommodations',
			description:
				'Carefully selected hotels near Haram in Makkah and Madinah for your convenience.'
		},
		{
			icon: 'heroicons:academic-cap',
			title: 'Religious Guidance',
			description: 'Certified scholars provide comprehensive training on Hajj and Umrah rituals.'
		},
		{
			icon: 'heroicons:globe-alt',
			title: '24/7 Support',
			description: 'Round-the-clock assistance from booking to your safe return home.'
		}
	];

	const achievements = [
		{ icon: 'heroicons:trophy', text: 'Ministry of Hajj Certified Partner' },
		{ icon: 'heroicons:star', text: 'ISO 9001:2015 Quality Certified' },
		{ icon: 'heroicons:check-badge', text: 'IATA Accredited Travel Agency' },
		{ icon: 'heroicons:building-office', text: '50+ Partner Hotels in Makkah & Madinah' }
	];

	const countries = [
		{ icon: 'twemoji:flag-saudi-arabia', name: 'Saudi Arabia' },
		{ icon: 'twemoji:flag-india', name: 'India' },
		{ icon: 'twemoji:flag-united-arab-emirates', name: 'UAE' },
		{ icon: 'twemoji:flag-malaysia', name: 'Malaysia' },
		{ icon: 'twemoji:flag-united-kingdom', name: 'United Kingdom' }
	];

	function animateStats() {
		const statElements = gsap.utils.toArray('.stat-value');

		statElements.forEach((element, i) => {
			const endValue = parseInt(element.dataset.value, 10);
			let counter = { val: 0 };

			gsap.to(counter, {
				val: endValue,
				duration: 2,
				delay: i * 0.2,
				ease: 'power2.out',
				onUpdate: () => {
					element.textContent = Math.floor(counter.val);
				}
			});
		});
	}

	onMount(() => {
		animateStats();
	});
</script>

<svelte:head>
	<title>About | Hijra</title>
	<meta
		name="description"
		content="Learn more about Hijra, our mission, and the services we offer to pilgrims." />
	<meta
		name="keywords"
		content="Hajj packages, Umrah packages, Hajj from India, Umrah from Chennai, affordable Hajj packages, Makkah hotel booking, Madinah hotel booking, pilgrimage services, Hajj visa, Umrah visa" />
	<link rel="canonical" href="https://hijra-portal.vercel.app/about" />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "TravelAgency",
			"name": "About | Hijra",
			"description": "Learn more about Hijra, our mission, and the services we offer to pilgrims.",
			"areaServed": ["Saudi Arabia", "India", "UAE", "Malaysia", "United Kingdom"],
			"serviceType": ["Hajj Packages", "Umrah Packages", "Islamic Tours", "Pilgrimage Services"],
			"url": "https://hijra-portal.vercel.app/about"
		}
	</script>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="About | Hijra" />
	<meta property="og:image" content="{page.url.origin}/ogimage.png" />
	<meta property="og:url" content="{page.url.origin}/about" />
	<meta
		property="og:description"
		content="Learn more about Hijra, our mission, and the services we offer to pilgrims." />
</svelte:head>

<!-- Hero Section -->
<div
	class="relative overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50 py-16 sm:py-20 lg:py-24">
	<div class="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<p class="text-sm font-medium tracking-widest text-emerald-700 uppercase">About Hijra</p>
		<h1 class="mt-4 text-4xl font-light tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
			Guiding Souls on Their <span class="font-medium text-emerald-700">Sacred Journey</span>
		</h1>
		<p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600 lg:text-xl">
			For over 15 years, we've been bridging the gap between spiritual aspiration and access —
			making the journey of a lifetime accessible, affordable, and spiritually fulfilling.
		</p>
	</div>

	<!-- Decorative background pattern -->
	<div class="pointer-events-none absolute inset-0 opacity-20">
		<svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
			<pattern id="dots-about" width="100" height="100" patternUnits="userSpaceOnUse">
				<circle cx="50" cy="50" r="1" fill="currentColor" />
			</pattern>
			<rect width="100%" height="100%" fill="url(#dots-about)" />
		</svg>
	</div>
</div>

<!-- Stats Section -->
<!-- <div class="border-b border-gray-100 bg-white py-12 sm:py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {#each stats as stat}
                <div class="text-center">
                    <p class="text-4xl font-light tracking-tight text-emerald-700 sm:text-5xl">
                        <span class="stat-value" data-value={stat.value}>0</span>
                        <span class="text-gray-400">{stat.suffix}</span>
                    </p>
                    <p class="mt-2 text-sm font-medium text-gray-600">{stat.label}</p>
                </div>
            {/each}
        </div>
    </div>
</div> -->

<!-- Mission Section -->
<section class="bg-white py-16 sm:py-20 lg:py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
			<div class="order-2 lg:order-1">
				<img
					src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.1.0"
					alt="Pilgrims at the Holy Mosque"
					class="aspect-square w-full rounded-2xl object-cover shadow-2xl"
					loading="lazy" />
			</div>
			<div class="order-1 space-y-6 lg:order-2">
				<div>
					<p class="text-sm font-medium tracking-widest text-emerald-700 uppercase">Our Mission</p>
					<h2 class="mt-2 text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
						Making Sacred <span class="font-medium text-emerald-700">Journeys Accessible</span>
					</h2>
				</div>
				<p class="text-sm text-gray-600 md:text-base">
					Headquartered in Saudi Arabia, we serve pilgrims who dream of performing Hajj and Umrah
					but face barriers like complex visa processes, expensive packages, and lack of reliable
					support.
				</p>
				<p class="text-sm text-gray-600 md:text-base">
					From personalized counseling to on-ground support with experienced guides and religious
					scholars, we handle every detail with care and expertise — ensuring your focus remains on
					the spiritual significance of your journey.
				</p>
				<blockquote class="border-l-4 border-emerald-600 bg-emerald-50 p-4 text-gray-700 italic">
					"Facilitating the journey to the House of Allah is not just a business — it's an honor and
					a sacred responsibility that we carry with devotion."
				</blockquote>
			</div>
		</div>
	</div>
</section>

<!-- Our Values -->
<section class="bg-white py-8 sm:py-12 md:py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-12 text-center sm:mb-16">
			<p class="text-sm font-medium tracking-widest text-emerald-700 uppercase">Core Values</p>
			<h2 class="mt-2 text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
				Principles That <span class="font-medium text-emerald-700">Guide Us</span>
			</h2>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
			{#each values as value}
				<div
					class="group relative overflow-hidden rounded-2xl bg-linear-to-br from-gray-50 to-white p-6 ring-1 ring-gray-100 transition-all hover:shadow-lg/5 sm:p-8">
					<!-- <div class="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-emerald-600 transition-transform duration-300 group-hover:scale-x-100"></div> -->
					<div
						class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100">
						<Icon icon={value.icon} class="h-6 w-6" />
					</div>
					<h3 class="mb-3 text-xl font-medium text-gray-900">{value.title}</h3>
					<p class="text-sm leading-relaxed text-gray-600">{value.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Certifications & Achievements -->
<!-- <section class="bg-white py-8 md:py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-12 text-center">
            <p class="text-sm font-medium tracking-widest text-emerald-700 uppercase">Certifications</p>
            <h2 class="mt-2 text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
                Recognized for <span class="font-medium text-emerald-700">Excellence</span>
            </h2>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {#each achievements as achievement}
                <div class="flex items-center gap-4 rounded-xl bg-linear-to-br from-emerald-50 to-teal-50 p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div class="flex-shrink-0">
                        <Icon icon={achievement.icon} class="h-8 w-8 text-emerald-700" />
                    </div>
                    <p class="text-sm font-medium text-gray-900">{achievement.text}</p>
                </div>
            {/each}
        </div>
    </div>
</section> -->

<!-- Global Presence -->
<section class="bg-white py-8 md:py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<p class="text-sm font-medium tracking-widest text-emerald-700 uppercase">Global Presence</p>
			<h2 class="mt-2 text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
				Serving Pilgrims <span class="font-medium text-emerald-700">Worldwide</span>
			</h2>
			<p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
				We operate across multiple countries to serve pilgrims from diverse communities.
			</p>
		</div>

		<div class="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
			{#each countries as country}
				<div class="group flex flex-col items-center gap-3 transition-transform hover:scale-110">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 ring-1 ring-gray-100 transition-all group-hover:bg-emerald-50 group-hover:ring-emerald-200">
						<Icon icon={country.icon} class="h-10 w-10" />
					</div>
					<p class="text-sm font-medium text-gray-700">{country.name}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="bg-linear-to-r from-emerald-700 to-teal-700 py-16 sm:py-20">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<h2 class="text-3xl font-light text-white sm:text-4xl">Ready to Start Your Sacred Journey?</h2>
		<p class="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
			Join thousands of satisfied pilgrims who have trusted us with their once-in-a-lifetime
			spiritual experience.
		</p>
		<div class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
			<Button
				href="/packages"
				text="Explore Packages"
				icon="ph:arrow-right-bold"
				class="bg-white text-emerald-700 hover:bg-emerald-50" />
			<Button
				href="/contact"
				text="Book Free Consultation"
				variant="pill"
				class="border-white/30 bg-transparent px-8 py-3 text-white hover:bg-white/10" />
		</div>
	</div>
</section>
