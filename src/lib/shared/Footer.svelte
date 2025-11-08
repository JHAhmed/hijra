<script>
    import Icon from '@iconify/svelte';
    import logo from '$lib/assets/logo.svg';
    import favicon from '$lib/assets/favicon.svg';

    import { socials } from '$lib';

    const footerLinks = [
        {
            title: 'Study Abroad',
            links: [
                { name: 'Hijra Portal', url: '/hijra-portal' },
                { name: 'Available Courses', url: '/available-courses' },
                { name: 'Our Packages', url: '/packages' },
                { name: 'Profile', url: '/hijra-portal/profile' }
            ]
        },
        {
            title: 'Useful Links',
            links: [
                { name: 'About Us', url: '/about' },
                { name: 'FAQ', url: '/faq' }
            ]
        }
    ];
</script>

<footer class="mx-auto w-full border-t border-gray-200 bg-gray-50">
    <!-- Main footer content -->
    <div class="grid grid-cols-1 lg:grid-cols-2">
        <!-- Left Side: Brand Name -->
        <div class="flex items-center justify-center border-b border-gray-200 p-8 text-center lg:border-b-0 lg:border-r lg:p-16 lg:text-left">
            <p class="text-5xl font-medium leading-16 md:leading-24  tracking-tighter text-black md:text-6xl lg:text-7xl">
                <span class="text-primary">Hijra</span> <br />
                <span class="text-gray-700 font-normal">By</span> PBIS
            </p>
        </div>

        <!-- Right Side: Links -->
        <div class="flex flex-col">
            <!-- Footer Navigation Links -->
            <div class="grid grow grid-cols-1 sm:grid-cols-2">
                {#each footerLinks as link, i}
                    <div class="flex flex-col p-8 lg:p-12 {i === 0 ? 'border-b sm:border-b-0 sm:border-r' : 'border-b sm:border-b-0'} border-gray-200">
                        <h3 class="mb-4 text-base font-semibold tracking-wider text-black uppercase">
                            {link.title}
                        </h3>
                        <div class="flex flex-col space-y-3">
                            {#each link.links as item}
                                <a
                                    href={item.url}
                                    class="text-sm text-gray-600 transition-all duration-150 hover:text-primary "
                                >
                                    {item.name}
                                </a>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>

            <!-- Social Media Links -->
            <div class="grid w-full grid-cols-2 md:grid-cols-4">
                {#each socials as link, i}
                    <a
                        href={link.url}
                        class="flex w-full group items-center border-t border-gray-200 p-4 transition-colors duration-200 hover:bg-gray-100
                        {i % 2 !== 1 ? 'border-r' : ''} 
                        {i < 2 ? 'md:border-r' : ''} 
                        {i === 3 ? 'md:border-r-0' : ''}"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.name}
                    >
                        <Icon icon={link.icon} class="h-5 w-5 shrink-0 text-gray-700 {`group-hover:text-${link.hoverColor}`}" />
                        <span class="ml-3 grow text-sm tracking-tight text-gray-800">{link.name}</span>
                        <Icon icon="heroicons:arrow-up-right" class="h-4 w-4 text-gray-500" />
                    </a>
                {/each}
            </div>
        </div>
    </div>

    <!-- Bottom Copyright Bar -->
	<div class="relative mx-auto flex flex-col py-4 md:py-0 gap-8 md:flex-row items-center justify-between bg-secondary px-4 lg:px-8">
	
		<div
			class="md:hidden flex items-center justify-center"
		>
			<a href="/" title="" class="flex items-center justify-center">
				<img class="h-5 w-auto md:h-6" src={logo} alt="Logo" />
			</a>
		</div>
	
	
		<div class="flex space-x-4 md:py-4 lg:space-x-6">
			<p class="text-xs lg:text-sm text-gray-100 text-center mx-auto">© 2025 Hijra • All rights reserved</p>
		</div>

		<!-- <div class="grow"></div> -->

		<div
			class="md:flex hidden absolute top-2/4 left-2/4 mx-auto -translate-x-2/4 -translate-y-2/4 transform items-center justify-center"
		>
			<a href="/" title="" class="flex items-center justify-center">
				<img class="h-5 w-auto lg:h-6" src={logo} alt="Logo" />
			</a>
		</div>

		<div
			class="flex flex-col items-center justify-center space-x-2 text-center text-xs lg:text-sm font-medium lg:flex-row"
		>
			<a href="https://proflobiz.in/" target="_blank" class="font-normal text-gray-200"
				>Powered By <span
					class="font-medium text-pink-300 decoration-pink-300 decoration-2 underline-offset-2 hover:underline"
					>PBIS</span
				>.</a
			>
		</div>
	</div>
</footer>
