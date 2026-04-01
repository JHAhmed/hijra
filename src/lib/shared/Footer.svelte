<script>
	import Icon from '@iconify/svelte';
	import logo from '$lib/assets/favicon.svg';
	import dolphinLogo from '$lib/assets/dolphinLogo.png';

	const footerData = {
		links: [
			{
				label: 'Services',
				items: [
					{ label: 'Umrah Packages', href: '/packages' },
					{ label: 'Hajj Services', href: '/packages' },
					{ label: 'Visa Processing', href: '/contact' }
				]
			},
			{
				label: 'Company',
				items: [
					{ label: 'About Us', href: '/about' },
					{ label: 'Our Mission', href: '/about' },
					{ label: 'Testimonials', href: '/' }
				]
			},
			{
				label: 'Support',
				items: [
					{ label: 'Pilgrim Guide', href: '/guide' },
					{ label: 'Contact Us', href: '/contact' },
					{ label: 'FAQ', href: '/#faq' }
				]
			}
		]
	};

	// Social Media Data with Specific Brand Colors
	const socialLinks = [
		{ icon: 'mdi:linkedin', color: '#0077b5', label: 'LinkedIn' },
		{ icon: 'mdi:instagram', color: '#E4405F', label: 'Instagram' },
		{ icon: 'mdi:twitter', color: '#1DA1F2', label: 'Twitter' },
		{ icon: 'mdi:youtube', color: '#FF0000', label: 'YouTube' }
	];

	const currentYear = new Date().getFullYear();
</script>

<footer class="w-full bg-white px-6 pb-8 text-secondary antialiased md:px-12">
	<div class="mx-auto max-w-8xl">
		<div
			class="grid grid-cols-1 gap-10 border-b border-gray-100 pt-8 pb-12 md:pb-16 lg:grid-cols-12 lg:gap-8">
			<div class="flex flex-col gap-6 md:gap-8 lg:col-span-4">
				<div>
					<a
						href="https://dolphinhaj.com/"
						target="_blank"
						rel="noopener noreferrer"
						class="group/logo inline-flex items-center gap-3">
						<img src={dolphinLogo} alt="Dolphin Haj" class="h-10 object-contain" />
					</a>

					<div class="mt-4 flex items-center gap-3">
						<span class="text-xs font-semibold tracking-wider text-gray-400 uppercase">Powered by</span>
						<a href="/" class="inline-flex items-center gap-1.5">
							<!-- <img src={logo} alt="Hijrah" class="h-4 w-4 object-contain" /> -->
							<span class="text-sm font-bold tracking-tight text-secondary">Hijrah<span class="text-primary">.</span></span>
						</a>
					</div>

					<p class="mt-4 max-w-xs text-sm leading-relaxed font-medium text-gray-500">
						With 29 years of Hajj group organizing experience, Dolphin Air Services is one of the
						leading Haj Group Organisers in Tamilnadu, India.
					</p>
				</div>

				<div class="flex flex-col gap-3 text-sm text-gray-500">
					<a
						href="https://goo.gl/maps/gNqTixa754Lsrbn67"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-start gap-2 font-medium transition-colors hover:text-primary">
						<Icon icon="heroicons:map-pin" class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
						<span>13A Williams Road, Opp. Femina Shopping Mall, Trichy, India</span>
					</a>
					<a
						href="tel:+91-9791969994"
						class="flex items-center gap-2 font-medium transition-colors hover:text-primary">
						<Icon icon="heroicons:phone" class="h-4 w-4 shrink-0 text-primary" />
						<span>+91 97919 69994</span>
					</a>
					<a
						href="https://wa.me/919791969994?text=Hello%20Dolphin,%20I%20have%20an%20enquiry"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 font-medium transition-colors hover:text-primary">
						<Icon icon="mdi:whatsapp" class="h-4 w-4 shrink-0 text-primary" />
						<span>WhatsApp Us</span>
					</a>
					<a
						href="mailto:dolphinairservices@gmail.com"
						class="flex items-center gap-2 font-medium transition-colors hover:text-primary">
						<Icon icon="heroicons:envelope" class="h-4 w-4 shrink-0 text-primary" />
						<span>dolphinairservices@gmail.com</span>
					</a>
				</div>

			</div>

			<div class="hidden lg:col-span-2 lg:block"></div>

			<div class="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-10 lg:col-span-6">
				{#each footerData.links as section}
					<div class="flex flex-col gap-4 md:gap-6">
						<span
							class="text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase md:text-[11px]"
							>{section.label}</span>
						<ul class="flex flex-col gap-2 md:gap-3">
							{#each section.items as item}
								<li>
									<a
										href={item.href}
										class="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-primary md:text-[15px]">
										{item.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<div class="flex flex-col items-center justify-between gap-6 pt-8 md:flex-row">
			<p class="text-center text-xs font-medium text-gray-400 md:text-left">
				© {currentYear} Dolphin Air Services &middot; Hijrah Portal. All rights reserved.
			</p>

			<a
				href="https://proflobiz.in/"
				target="_blank"
				class="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-400
                       shadow-pink-300 transition-all duration-200 hover:hard-shadow-md
                      ">
				<span
					class="text-[10px] font-bold tracking-wider uppercase transition-colors group-hover:text-black/60"
					>Powered By</span>
				<span class="text-xs font-bold text-pink-300">PBIS</span>
			</a>
		</div>
	</div>
</footer>
