<script>
	import { Button } from '$components';
	import Icon, { loadIcon } from '@iconify/svelte';
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Testimonial from '$components/Testimonial.svelte';
	import FAQ from '$components/FAQ.svelte';
	import CTA from '$shared/CTA.svelte';
	import { page } from '$app/state';

	const items = [
		// --- ROW 1 ---
		{
			type: 'review',
			span: 'lg:col-span-2', // Wide
			name: 'Yusuf Ahmed',
			role: 'Hajj Package',
			location: 'London, UK',
			quote:
				"The proximity to the Haram was unbelievable. Hijrah didn't just book a hotel; they curated an environment where I could focus entirely on my Ibadah. It felt like a sanctuary."
		},
		{
			type: 'image',
			span: 'lg:col-span-1', // Tall
			src: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=1000&auto=format&fit=crop',
			label: 'The Holy City',
			alt: 'Makkah al-Mukarramah'
		},

		// --- ROW 2 ---
		{
			type: 'image',
			span: 'lg:col-span-1', // Tall
			src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
			label: 'Global Reach',
			alt: '15+ Countries Served'
		},
		{
			type: 'review',
			span: 'lg:col-span-1', // Standard (Was Wide)
			name: 'Fatima Zahra',
			role: 'Premium Umrah',
			location: 'Dubai, UAE',
			quote:
				'Walking distance to the Kaaba, and the ground team treated us with the hospitality of the Ansar.'
		},
		{
			type: 'review',
			span: 'lg:col-span-1', // NEW CARD
			name: 'Zaid Ibrahim',
			role: 'Group Leader',
			location: 'Cape Town, SA',
			quote:
				"I have led groups for 10 years. Hijrah's attention to logistical detail is unmatched in the industry."
		}
	];

	const stats = [
		{
			value: '10',
			suffix: '+',
			label: 'Years Experience',
			desc: 'Serving the guests of Allah since 2010.'
		},
		{
			value: '15',
			suffix: '+',
			label: 'Global Reach',
			desc: 'Pilgrims served from over 15 different nations.'
		},
		{
			value: '100',
			suffix: '%',
			label: 'Satisfaction',
			desc: 'Based on post-Hajj feedback surveys.'
		}
	];

	const reelImages = [
		'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=800&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=800&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=800&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=800&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop'
	];

	const steps = [
		{
			num: '01',
			title: 'Consultation',
			desc: "We begin by understanding your intention. Whether it's Hajj or Umrah, we align on your budget, dates, and spiritual requirements."
		},
		{
			num: '02',
			title: 'Processing',
			desc: 'We handle the bureaucracy. From visa applications to vaccination records, our team ensures every document is compliant.'
		},
		{
			num: '03',
			title: 'The Journey',
			desc: 'Depart with peace of mind. Our on-ground team receives you in Jeddah and remains by your side until your return.'
		}
	];

	async function animateStats() {
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

	onMount(async () => {
		await animateStats();
	});
</script>

<svelte:head>
	<title>Hijrah Portal - Your Gateway to The journey of a lifetime.</title>
	<meta
		name="description"
		content="Experience the sacred pilgrimage with a focus on spirituality and comfort. We handle the complex logistics; you focus on the divine connection." />

	<meta property="og:title" content="Hijrah Portal - Your Gateway to The journey of a lifetime." />
	<meta
		property="og:description"
		content="Experience the sacred pilgrimage with a focus on spirituality and comfort. We handle the complex logistics; you focus on the divine connection." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.origin} />
	<meta property="og:image" content="{page.url.origin}/ogimage.png" />
</svelte:head>

<!-- Hero Section -->
<section
	class="relative flex min-h-screen w-full flex-col overflow-hidden bg-white text-secondary selection:bg-primary selection:text-white">
	<main
		class="relative z-10 mx-auto flex w-full max-w-8xl flex-1 flex-col items-center justify-center px-6 py-12 text-center md:py-16">
		<div
			class="animate-fade-in-up mb-8 inline-flex translate-y-4 items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-2.5 opacity-0">
			<div class="flex items-center gap-2">
				<div class="h-1.5 w-1.5 rounded-full bg-primary"></div>
				<span class="text-sm font-bold tracking-widest text-secondary uppercase">Hajj 2026</span>
			</div>
			<span class="h-3.5 w-px bg-gray-200"></span>
			<span class="text-sm font-medium text-gray-500">Registrations Open</span>
		</div>

		<h1
			class="animate-fade-in-up mb-10 translate-y-4 text-5xl leading-tight text-secondary opacity-0 delay-100 md:text-7xl lg:text-9xl">
			<span class="block font-normal tracking-tight"> The journey of a </span>
			<span class="-mt-2 block font-light tracking-tighter md:-mt-4">
				<span class="text-primary">lifetime.</span>
			</span>
		</h1>

		<p
			class="animate-fade-in-up mx-auto mb-12 max-w-2xl translate-y-4 text-lg leading-relaxed font-normal text-gray-500 opacity-0 delay-200 md:text-xl">
			Experience the sacred pilgrimage with a focus on spirituality and comfort. We handle the
			complex logistics; you focus on the divine connection.
		</p>

		<div
			class="animate-fade-in-up flex w-full translate-y-4 flex-col items-center gap-5 opacity-0 delay-300 sm:w-auto sm:flex-row">
			<Button href="/packages" text="Explore Packages" size="lg" />

			<Button href="/about" text="Our Story" variant="secondary" size="lg" />
		</div>
	</main>

	<div class="animate-fade-in-up mt-12 w-full pb-8 opacity-0 delay-500 md:pb-12">
		<div class="pointer-events-none relative flex overflow-hidden select-none">
			<div class="animate-marquee flex gap-4 md:gap-6">
				{#each [...reelImages, ...reelImages] as img}
					<div
						class="relative h-[200px] w-[280px] shrink-0 overflow-hidden rounded-xl bg-gray-100 md:h-[260px] md:w-[360px]">
						<img src={img} alt="Hajj Location" class="h-full w-full object-cover" loading="lazy" />
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Stats Section -->
<section class="w-full border-b border-gray-100 bg-white py-12 text-secondary md:py-16">
	<div class="mx-auto max-w-8xl px-6 md:px-12">
		<div class="flex flex-col items-start justify-between gap-20 lg:flex-row lg:gap-12">
			<div class="pt-4 lg:w-1/3">
				<h3 class="mb-6 text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
					Built on <br />
					<span class="text-primary">trust & tradition.</span>
				</h3>
				<p class="text-lg leading-relaxed text-gray-500">
					Numbers aren't just metrics to us; they represent individual spiritual journeys
					facilitated with precision, care, and the Amanah (trust) placed in our hands.
				</p>
			</div>

			<div class="grid w-full grid-cols-1 gap-10 md:grid-cols-3 md:gap-0 lg:w-2/3">
				{#each stats as stat, i}
					<div
						class="group relative flex cursor-default flex-col border-t border-gray-200 transition-colors duration-500 first:pl-0 hover:border-primary md:px-8">
						<div class="mb-4 flex items-center justify-between pt-6">
							<span
								class="text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors duration-300 group-hover:text-primary">
								{stat.label}
							</span>
						</div>

						<div class="mb-4">
							<span
								class="text-7xl leading-none font-medium tracking-tighter text-secondary transition-colors group-hover:text-black md:text-8xl">
								{stat.value}<span
									class="align-top text-4xl text-gray-300 transition-colors duration-300 group-hover:text-primary"
									>{stat.suffix}</span>
							</span>
						</div>

						<p
							class="max-w-xs text-sm leading-tight font-medium text-gray-400 opacity-60 transition-opacity duration-300 group-hover:opacity-100">
							{stat.desc}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Journey Steps -->
<section class="w-full border-b border-gray-100 bg-white py-12 text-secondary md:py-16">
	<div class="mx-auto max-w-8xl px-6 md:px-12">
		<div class="mb-20 max-w-2xl md:mb-24">
			<span class="mb-4 block text-sm font-bold tracking-widest text-primary uppercase">
				The Roadmap
			</span>
			<h2 class="text-4xl font-semibold tracking-tighter text-secondary md:text-6xl">
				Your path to the <br />
				<span class="text-primary">Sacred House.</span>
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-16">
			{#each steps as step}
				<div
					class="group relative flex cursor-default flex-col border-t border-gray-200 pt-8 transition-colors duration-500 hover:border-primary">
					<div class="mb-8">
						<span
							class="text-6xl font-light tracking-tighter text-gray-200 transition-colors duration-500 select-none group-hover:text-secondary md:text-7xl">
							{step.num}
						</span>
					</div>

					<div class="relative z-10">
						<h3
							class="mb-4 flex items-center text-2xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-4">
							<span
								class="absolute -left-4 h-1.5 w-1.5 scale-0 rounded-full bg-primary opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
							></span>

							{step.title}
						</h3>

						<p
							class="max-w-sm text-base leading-relaxed text-gray-500 transition-colors group-hover:text-gray-600">
							{step.desc}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Testimonials -->
<section
	class="relative w-full overflow-hidden bg-gray-50 px-6 py-12 text-secondary antialiased md:px-12 md:py-16">
	<div
		class="absolute inset-0 opacity-[0.5]"
		style="background-image: radial-gradient(#E5E5E5 1px, transparent 1px); background-size: 32px 32px;">
	</div>

	<div class="relative z-10 mx-auto max-w-8xl">
		<div class="mb-16 flex flex-col justify-between gap-10 md:flex-row md:items-end">
			<div>
				<span class="mb-3 block text-sm font-bold tracking-widest text-primary uppercase">
					Testimonials
				</span>
				<h2 class="text-3xl font-medium tracking-tight text-black md:text-5xl">
					Blessed Journeys, <br />
					<span class="text-primary">Spiritual Memories.</span>
				</h2>
			</div>

			<div
				class="flex items-center gap-4 rounded-full border border-gray-200 bg-white p-2 pr-5 shadow-primary transition-all duration-300 hover:hard-shadow-md">
				<div class="flex -space-x-2">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-50 text-gray-300">
						<Icon icon="heroicons:user" class="h-3 w-3" />
					</div>
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-gray-400">
						<Icon icon="heroicons:user" class="h-3 w-3" />
					</div>
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-bold text-white">
						10k
					</div>
				</div>
				<div class="flex flex-col justify-center">
					<span class="mb-0.5 leading-none font-bold tracking-wide text-black uppercase"
						>Pilgrims Served</span>
					<span class="text-sm leading-none font-medium text-gray-400">Across 15+ Countries</span>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
			{#each items as item, i}
				{#if item.type === 'review'}
					<div
						class="group relative flex min-h-[260px] flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 transition-colors duration-500 hover:border-primary {item.span}">
						<div
							class="pointer-events-none absolute top-0 right-0 h-48 w-48 text-black opacity-[0.03]">
							<svg viewBox="0 0 200 200" fill="currentColor" class="h-full w-full"
								><path
									d="M100 0L122.5 22.5L145 0L167.5 22.5L190 0L200 10L190 20L200 30L190 40L200 50L177.5 72.5L200 95L190 105L200 115L177.5 137.5L200 160L190 170L200 180L190 190L200 200L177.5 177.5L155 200L132.5 177.5L110 200L100 190L90 200L67.5 177.5L45 200L22.5 177.5L0 200L10 190L0 180L10 170L0 160L22.5 137.5L0 115L10 105L0 95L22.5 72.5L0 50L10 40L0 30L10 20L0 10L22.5 32.5L45 10L67.5 32.5L90 10L100 0Z" /></svg>
						</div>

						<div class="relative z-10">
							<div
								class="mb-4 text-gray-300 transition-colors duration-300 group-hover:text-primary">
								<Icon icon="ph:quotes-fill" class="h-6 w-6" />
							</div>

							<p
								class="mb-6 text-lg leading-relaxed font-medium tracking-tight text-secondary md:text-xl">
								"{item.quote}"
							</p>
						</div>

						<div>
							<div class="mb-4 flex items-center gap-3 opacity-20">
								<div class="h-px flex-1 bg-black"></div>
								<div class="h-1.5 w-1.5 rotate-45 bg-primary"></div>
								<div class="h-px flex-1 bg-black"></div>
							</div>

							<div class="relative z-10 flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div
										class="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-[#F9F9F9] text-xs font-bold text-primary">
										{item.name.charAt(0)}
									</div>
									<div class="flex flex-col">
										<h4 class="mb-1 text-sm leading-none font-bold text-black">{item.name}</h4>
										<div
											class="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
											<span>{item.location}</span>
											<span class="text-primary">• {item.role}</span>
										</div>
									</div>
								</div>
								<div class="text-gray-300 transition-colors duration-300 group-hover:text-primary">
									<Icon icon="ph:seal-check-fill" class="h-5 w-5" />
								</div>
							</div>
						</div>
					</div>
				{:else}
					<div
						class="group relative min-h-[260px] overflow-hidden rounded-2xl {item.span} border border-gray-200">
						<div
							class="absolute inset-0 bg-cover bg-center transition-transform duration-700"
							style="background-image: url('{item.src}');">
						</div>

						<div
							class="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80">
						</div>

						<div class="absolute bottom-0 left-0 w-full p-6">
							<div class="mb-2 flex items-center gap-2">
								<div class="h-1.5 w-1.5 rounded-full bg-primary"></div>
								<span class="text-[10px] font-bold tracking-widest text-primary uppercase"
									>{item.label}</span>
							</div>
							<p class="text-lg font-medium tracking-tight text-white">
								{item.alt}
							</p>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>

<!-- FAQ -->
<section class="bg-linear-to-b from-gray-50 to-white py-8 md:py-16">
	<FAQ />
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
	.delay-300 {
		animation-delay: 0.3s;
	}
	.delay-500 {
		animation-delay: 0.5s;
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

	.animate-marquee {
		animation: marquee 50s linear infinite;
		will-change: transform;
	}

	@keyframes marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
</style>
