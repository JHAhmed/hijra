<script>
    import { gsap } from 'gsap';
    import { onMount } from 'svelte';
    import { SplitText } from 'gsap/SplitText';
    import Icon from '@iconify/svelte';
    import { Accordion } from 'bits-ui';
    import { slide } from 'svelte/transition';
    import Package from '$components/Package.svelte';
	import { page } from '$app/state';

    gsap.registerPlugin(SplitText);

    let { data } = $props();
    let title = $state(null);
    let selectedCountry = $state('all');
    let uniqueCountries = $state([]);

    // $effect(() => {
    //     if (data.universities) {
    //         uniqueCountries = [...new Set(data.universities.map(u => u.country))].sort();
    //     }
    // });

    // let uniqueCountries = $state([]);

    let filteredUniversities = $state([]);
    // let filteredUniversities = $derived(
    //     selectedCountry === 'all' 
    //         ? data.universities 
    //         : data.universities.filter(u => u.country === selectedCountry)
    // );

    onMount(() => {
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
	<link rel="canonical" href="https://hijra-portal.vercel.app/our-packages" />
	<script type="application/ld+json">
		{
			"@context": "http://schema.org",
			"@type": "WebPage",
			"name": "Our Packages | Hijra",
			"url": "https://hijra-portal.vercel.app/our-packages"
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
            Discover the world-class institutions we partner with to provide accessible and high-quality
            medical education.
        </p>
        
        <!-- Country Filter Dropdown -->
        <div class="mt-8 flex justify-center">
            <div class="w-64">
                <label for="country-filter" class="mb-2 block text-sm font-medium text-gray-700">
                    Filter by Country
                </label>
                <select
                    id="country-filter"
                    bind:value={selectedCountry}
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Countries</option>
                    {#each uniqueCountries as country}
                        <option value={country}>{country.toUpperCase()}</option>
                    {/each}
                </select>
            </div>
        </div>
        
        <!-- Results Count -->
        <p class="mt-4 text-sm text-gray-600">
            Showing {filteredUniversities.length} {filteredUniversities.length === 1 ? 'university' : 'universities'}
        </p>

        <div class="p-6 border-dashed border rounded-xl border-gray-400 mt-6 w-fit mx-auto">
            <p class="text-xs md:text-sm text-gray-600">
                <span class="font-semibold">Note:</span> Kindly check the fields of study offered by each university before making a selection.
            </p>
        </div>
    </div>
</section>

<section class="border border-gray-300 bg-gray-50 px-8 py-20">
    <div class="mx-auto max-w-7xl">
        <div class="">
            <Accordion.Root
                type="multiple"
                class="grid grid-cols-2 gap-6 space-y-6 md:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16">
                {#each filteredUniversities as university}
                    <Package {university} />
                {/each}
            </Accordion.Root>
        </div>
    </div>
</section>

<section class="bg-white px-8 py-20 text-center">
    <div class="mx-auto max-w-4xl">
        <p class="mb-4 text-sm tracking-widest text-gray-600 uppercase">Our Commitment</p>
        <h2 class="text-4xl font-medium tracking-tighter text-black lg:text-5xl">
            Partnering with top universities to empower the next generation of medical professionals.
        </h2>
    </div>
</section>
