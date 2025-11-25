<script>
	import Icon from '@iconify/svelte';
	import logo from '$lib/assets/favicon.svg';

	const footerData = {
		links: [
			{
				label: 'Services',
				items: ['Umrah Packages', 'Hajj Services', 'Visa Processing']
			},
			{
				label: 'Company',
				items: ['About PBIS', 'Our Mission', 'Testimonials']
			},
			{
				label: 'Support',
				items: ['Pilgrim Guide', 'Contact Us', 'FAQ']
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
					<a href="/" class="group/logo inline-flex items-center gap-3">
						<img
							src={logo}
							alt="hijrah Logo"
							class="h-8 w-8 object-contain transition-transform duration-300 md:h-10 md:w-10" />
						<span class="text-3xl font-bold tracking-tighter text-black md:text-4xl">
							hijrah<span class="text-primary">.</span>
						</span>
					</a>

					<p class="mt-4 max-w-xs text-sm leading-relaxed font-medium text-gray-500">
						Your trusted gateway to the Holy Lands. Facilitating spiritual journeys with comfort and
						peace of mind.
					</p>
				</div>

				<div class="flex items-center gap-3">
					{#each socialLinks as { icon, color, label }}
						<a
							href="#"
							aria-label={label}
							style="--brand-color: {color}"
							class="group/social flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400
                                  transition-all duration-200 hover:hard-shadow-sm hover:border-(--brand-color) hover:text-(--brand-color)
                                  hover:shadow-[3px_3px_0px_0px_var(--brand-color)]
                                  
                                  
                                  ">
							<Icon {icon} class="h-5 w-5" />
						</a>
					{/each}
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
										href="#"
										class="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-primary md:text-[15px]">
										{item}
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
				© {currentYear} Hijrah Portal. All rights reserved.
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
