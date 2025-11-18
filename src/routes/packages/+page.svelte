<script>
    import { gsap } from 'gsap';
    import { onMount } from 'svelte';
    import { SplitText } from 'gsap/SplitText';
    import Icon from '@iconify/svelte';
    import { Accordion } from 'bits-ui';
    import { slide } from 'svelte/transition';
    import Package from '$components/Package.svelte';
	import { page } from '$app/state';
	import Dropdown from '$components/ui/Dropdown.svelte';

    gsap.registerPlugin(SplitText);

    let { data } = $props();
    let title = $state(null);
    let selectedPackage = $state('all');
    let uniqueTypes = $state([]);

    let packageTypes = $state([
        { value: 'all', label: 'All Types' },
        { value: 'hajj', label: 'Hajj' },
        { value: 'umrah', label: 'Umrah' },
    ]);

    // $effect(() => {
    //     if (data.universities) {
    //         uniqueTypes = [...new Set(data.universities.map(u => u.country))].sort();
    //     }
    // });

    // let uniqueTypes = $state([]);

    // let filteredPackages = $state([]);
    let filteredPackages = $derived(
        selectedPackage === 'all' 
            ? data.packages 
            : data.packages.filter(u => u.type === selectedPackage)
    );

    onMount(() => {
        console.log('Packages Data:', data);

        if (!title) return;
        const split = new SplitText(title, { type: 'words' });

        gsap.from(split.words, {
            y: 10,
            opacity: 0,
            duration: 1.0,
            delay: 0.5,
            ease: 'power2.out',
            stagger: 0.15
        });
    });
</script>

<svelte:head>
	<title>Our Packages | Hijra</title>
	<meta
		name="description"
		content="Discover the world-class institutions we partner with to provide accessible and high-quality medical education."
	/>
	<link rel="canonical" href="https://hijra-portal.vercel.app/packages" />
	<script type="application/ld+json">
		{
			"@context": "http://schema.org",
			"@type": "WebPage",
			"name": "Our Packages | Hijra",
			"url": "https://hijra-portal.vercel.app/packages"
		}
	</script>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Our Packages | Hijra" />
	<meta property="og:image" content="{page.url.origin}/ogimage.png" />
	<meta property="og:url" content="{page.url.origin}/" />
	<meta
		property="og:description"
		content="Discover the world-class institutions we partner with to provide accessible and high-quality medical education."
	/>
</svelte:head>

<section class="bg-white px-8 py-16 text-center">
    <div class="mx-auto max-w-5xl">
        <p class="mb-4 text-sm tracking-widest text-gray-600 uppercase">Explore</p>
        <h1 bind:this={title} class="text-5xl font-medium tracking-tighter text-black lg:text-7xl">
            Our Packages
        </h1>
        <p class="mx-auto mt-8 max-w-3xl text-lg font-normal tracking-[-0.015em] text-gray-700">
            Choose from a variety of thoughtfully curated travel packages designed to provide enriching spiritual journeys. Whether you're seeking the profound experience of Hajj or the serene devotion of Umrah, our packages cater to all your needs with comfort and convenience.
        </p>
        
        <!-- Country Filter Dropdown -->
        <div class="mt-8 flex justify-center space-x-4">
            <div class="w-64">
                <Dropdown
                    label="Select Package Type"
                    name="package-type"
                    items={packageTypes}
                    bind:value={selectedPackage}
                />
            </div>
            <!-- <div class="w-64">
                <Dropdown
                    label="Select Package Type"
                    name="package-type"
                    items={packageTypes}
                    bind:value={selectedPackage}
                    />
            </div> -->
        </div>
        
        <!-- Results Count -->
        <p class="mt-4 text-sm text-gray-600">
            Showing {filteredPackages.length} {filteredPackages.length === 1 ? 'package' : 'packages'}
        </p>

        <!-- <div class="p-6 border-dashed border rounded-xl border-gray-400 mt-6 w-fit mx-auto">
            <p class="text-xs md:text-sm text-gray-600">
                <span class="font-semibold">Note:</span> Kindly check the details of each package before making a selection.
            </p>
        </div> -->
    </div>
</section>

<section class="border border-gray-300 bg-gray-50 px-8 py-20">
    <div class="mx-auto max-w-7xl">
        <div class="">
            <Accordion.Root
                type="multiple"
                class="grid grid-cols-1 gap-6 space-y-6 md:grid-cols-1 md:gap-12 lg:grid-cols-1 lg:gap-16">
                {#each filteredPackages as travelPackage}
                    <Package {travelPackage} />
                {/each}
            </Accordion.Root>
        </div>
    </div>
</section>

<section class="bg-white px-8 py-20 text-center">
    <div class="mx-auto max-w-4xl">
        <p class="mb-4 text-sm tracking-widest text-gray-600 uppercase">Our Commitment</p>
        <h2 class="text-4xl font-medium tracking-tighter text-black lg:text-5xl">
            Your Spiritual Journey Begins Here
        </h2>
    </div>
</section>
