<script>
	import { Button } from '$components';
	import Icon, { loadIcon } from '@iconify/svelte';
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte';
	import Testimonial from '$components/Testimonial.svelte';
	import FAQ from '$components/FAQ.svelte';

	const testimonials = [
		{
			quote:
				'“Hijra helped me get my dream college in Russia. They were really helpful in every step of the process!”',
			name: 'Sathish Kumar',
			college: 'University of Moscow'
		},
		{
			quote: '“Studying abroad was a dream come true that Hijra helped me achieve”',
			name: 'Saghana Subramaniam',
			college: 'Russian Medical University'
		},
		{
			quote:
				"“From paperwork to admission, Hijra guided me at every step. I couldn't have asked for better support!”",
			name: 'Amanullah Mallick',
			college: 'St. Petersburg State University'
		},
		{
			quote:
				'“Getting into a medical college in Russia seemed impossible, but Hijra guided me all the way.”',
			name: 'Eswar Clinton',
			college: 'Belgorod Research University'
		}
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

	const stats = [
		{ label: 'Years of Service', value: '15', suffix: '+' },
		{ label: 'Happy Pilgrims', value: '5000', suffix: '+' },
		{ label: 'Satisfaction Rate', value: '100', suffix: '%' },
		{ label: 'Partner Hotels', value: '50', suffix: '+' }
	];

	const steps = [
		{
			icon: 'heroicons:phone',
			title: 'Free Consultation',
			description:
				'Speak with our certified Hajj/Umrah advisors to understand requirements and choose the right package for your needs.'
		},
		{
			icon: 'heroicons:document-text',
			title: 'Documentation & Visa',
			description:
				'We guide you through every document, handle visa processing, and ensure all paperwork is completed accurately.'
		},
		{
			icon: 'heroicons:map',
			title: 'Itinerary Planning',
			description:
				'Customize your journey with flight selections, hotel preferences, and ground transportation arrangements.'
		},
		{
			icon: 'heroicons:academic-cap',
			title: 'Pre-Departure Guidance',
			description:
				'Attend our comprehensive workshops covering rituals, health precautions, and travel tips for a blessed journey.'
		},
		{
			icon: 'heroicons:hand-raised',
			title: 'Dedicated Support',
			description:
				'24/7 on-ground assistance in Saudi Arabia ensures peace of mind throughout your sacred pilgrimage.'
		}
	];

	const quickLinks = [
		{ name: '2025 Packages', icon: 'heroicons:calendar', href: '/packages' },
		{ name: 'Journey Guide', icon: 'heroicons:information-circle', href: '/guides/' },
		{ name: 'Health Tips', icon: 'heroicons:heart', href: '/guides/' },
		{ name: 'Contact Experts', icon: 'heroicons:chat-bubble-left', href: '/contact' }
	];

	onMount(async () => {
		const icons = quickLinks.map((link) => link.icon).concat(steps.map((step) => step.icon));
		await Promise.all(icons.map((i) => loadIcon(i)));

		animateStats();
	});
</script>

<!-- TODO: Change hero style -->
<div
	class="relative overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50 py-12 sm:py-16 lg:py-20">
	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<!-- Hero Content -->
			<div class="space-y-6 lg:space-y-8">
				<div class="space-y-2">
					<p class="text-sm font-medium tracking-widest text-emerald-700 uppercase">
						Certified Travel Partner
					</p>
					<h1 class="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
						Your Sacred Journey <span class="font-medium text-emerald-700">Begins Here</span>
					</h1>
				</div>

				<p class="text-lg text-gray-600 lg:text-xl">
					Experience a blessed Hajj & Umrah with our end-to-end travel solutions. From visa
					processing to comfortable accommodations, we handle every detail with care and expertise.
				</p>

				<div class="flex flex-col gap-4 sm:flex-row">
					<Button
						href={auth.isAuthenticated ? '/dashboard' : '/register'}
						text="Explore Packages"
						icon="ph:arrow-right-bold"
						width="w-full sm:w-auto"
						class="justify-center" />
					<Button
						href="/contact"
						text="Contact Us"
						variant="pill"
						width="w-full sm:w-auto"
						class="justify-center px-8 py-3" />
				</div>
			</div>

			<!-- Video Section -->
			<div class="group relative">
				<div
					class="aspect-video overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300">
					<iframe
						class="h-full w-full"
						src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
						title="Hajj & Umrah Journey Guide"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen></iframe>
				</div>
			</div>
		</div>
	</div>

	<!-- Decorative background pattern -->
	<div class="pointer-events-none absolute inset-0 opacity-20">
		<svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
			<pattern id="dots" width="100" height="100" patternUnits="userSpaceOnUse">
				<circle cx="50" cy="50" r="1" fill="currentColor" />
			</pattern>
			<rect width="100%" height="100%" fill="url(#dots)" />
		</svg>
	</div>
</div>

<!-- Quick Links -->
<div class="border-y border-gray-100 bg-white py-6">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			{#each quickLinks as link}
				<a
					href={link.href}
					class="group flex items-center justify-center gap-3 rounded-xl bg-gray-50 p-4 transition-all hover:bg-emerald-50 hover:text-emerald-700">
					<Icon icon={link.icon} class="h-5 w-5 text-gray-600 group-hover:text-emerald-600" />
					<span class="text-sm font-medium text-gray-900">{link.name}</span>
				</a>
			{/each}
		</div>
	</div>
</div>

<!-- Stats Section -->
<div class="bg-white py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
			{#each stats as stat, i}
				<div class="text-center">
					<p class="text-4xl font-light tracking-tight text-emerald-700 sm:text-5xl lg:text-6xl">
						<span class="stat-value" data-value={stat.value}>0</span>
						<span class="text-gray-400">{stat.suffix}</span>
					</p>
					<p class="mt-2 text-sm font-medium text-gray-600">{stat.label}</p>
					<!-- {#if i < stats.length - 1}
                        <div class="hidden lg:block">
                            <div class="mx-auto h-16 w-px bg-gray-200"></div>
                        </div>
                    {/if} -->
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Journey Steps -->
<section class="bg-linear-to-b from-gray-50 to-white py-8 sm:py-12 md:py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-12 text-center sm:mb-16">
			<p class="text-sm font-medium tracking-widest text-emerald-700 uppercase">Our Process</p>
			<h2 class="mt-2 text-3xl font-light tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
				Five Steps to Your <span class="font-medium text-emerald-700">Sacred Journey</span>
			</h2>
		</div>

		<div class="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
			{#each steps as step, i}
				<div
					class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg sm:p-8">
					<div
						class="absolute top-0 left-0 h-1 w-full origin-left scale-x-0 bg-emerald-600 transition-transform duration-300 group-hover:scale-x-100">
					</div>
					<div
						class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
						<Icon icon={step.icon} class="h-6 w-6" />
					</div>
					<span class="mb-2 block text-xs font-semibold text-emerald-700 uppercase"
						>Step {i + 1}</span>
					<h3 class="mb-3 text-xl font-medium text-gray-900">{step.title}</h3>
					<p class="text-sm leading-relaxed text-gray-600">{step.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Testimonials -->
<section class="bg-white py-8 sm:py-12 md:py-20">
	<div class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
		<div class="mb-12 text-center sm:mb-16">
			<p class="text-sm font-medium tracking-widest text-emerald-700 uppercase">Testimonials</p>
			<h2 class="mt-2 text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
				Blessed Journeys, <span class="font-medium">Beautiful Memories</span>
			</h2>
		</div>

		<div class="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#each testimonials as testimonial}
				<Testimonial {...testimonial} />
			{/each}
		</div>
	</div>
</section>

<!-- FAQ -->
<section class="bg-linear-to-b from-gray-50 to-white py-8 sm:py-12 md:py-20">
	<FAQ />
</section>

<!-- Final CTA -->
<section class="bg-linear-to-r from-emerald-700 to-teal-700 py-16 sm:py-20">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<h2 class="text-3xl font-light text-white sm:text-4xl">Ready to Begin Your Sacred Journey?</h2>
		<p class="mx-auto mt-4 max-w-2xl text-emerald-100">
			Join thousands of pilgrims who have trusted us to deliver a seamless, spiritually fulfilling
			experience.
		</p>
		<div class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
			<Button
				href="/packages"
				text="View All Packages"
				icon="ph:arrow-right-bold"
				class="bg-white text-emerald-700 hover:bg-emerald-50" />

			<Button
				href="/contact"
				text="Get in Touch"
				variant="pill"
				class="border-white/30 bg-transparent px-8 py-3 text-white hover:bg-white/10" />
		</div>
	</div>
</section>
