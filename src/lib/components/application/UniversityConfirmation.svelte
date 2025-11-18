<script>
    import { Input, Dropdown } from "$components";
    import Icon from "@iconify/svelte";

    let { shortlisted, onNext, onPrevious, universities } = $props();

    let displayUniversities = $derived.by(() => {
        const newUnis = universities.filter(uni => shortlisted.includes(uni.id));
        return newUnis;
    });
    // let shortlisted = $state([]);
    // let selectionsLeft = $derived(3 - shortlisted.length);
	
    // function toggleShortlist(uniId) {
    //     const index = shortlisted.indexOf(uniId);
    //     if (index === -1) {
    //         if (shortlisted.length < 3) {
    //             shortlisted = [...shortlisted, uniId];
    //             // shortlistedUniversities.push(uniId);
    //         }
    //     } else {
    //         shortlisted = shortlisted.filter(val => val !== uniId);
    //         // shortlistedUniversities = shortlistedUniversities.filter(val => val !== uniId);
    //     }
    // }
</script>

<div class="space-y-8 rounded-2xl bg-gray-50 p-4 md:p-8">
    <h2 class="text-2xl md:text-3xl font-medium tracking-tight text-gray-800">Selected Universities</h2>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each displayUniversities as uni}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div 
                class="flex flex-col items-center justify-center p-4 md:p-6 bg-gray-100 hover:bg-primary/10 rounded-lg border border-gray-400 cursor-pointer"
            >

                <div class="flex flex-col md:flex-row grow h-full w-full space-y-4 md:space-y-0 md:space-x-4 items-center justify-start ">
                    
					<div class="w-24 h-24 ">
						<img src={uni.image.url} alt="{uni.name}" class="w-24 h-24 object-cover rounded-lg mb-2 md:mb-0" />
					</div>
					

					<div class="flex flex-col space-y-2">
                        <p class=" text-center md:text-left">{uni.name}</p>
                        <p class="text-sm text-gray-600  text-center md:text-left">MBBS</p>
                    </div>

                </div>

                <div class="px-4 my-4 h-px w-full bg-gray-400"></div>

                <div class="flex flex-col grow w-full md:flex-row items-center justify-start ">
                    <div class="flex items-center justify-start grow">
                        <!-- <a href="/packages" target="_blank"  class="text-sm">Learn More</a> -->
                        <div class="w-0.5 flex h-4 bg-gray-300 mx-2"></div>
                        <p class="text-sm py-1  text-gray-600 text-center md:text-left">Tuition Fees: <span class="text-black">${uni.fees.toLocaleString()}</span></p>
                    </div>

                    <div class="rounded-full bg-green-300 p-1 px-3 text-xs mt-4 md:mt-0">
                        <p class="tracking-tight text-gray-800">Shortlisted</p>
                    </div>

                </div>
            </div>
        {/each}
    </div>

    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        		<button onclick={onPrevious} class="bg-secondary flex cursor-pointer items-center group justify-center rounded-full px-6 py-2 text-white shadow-lg">
			<Icon icon="heroicons:arrow-left" class="mr-4 size-5 text-white transition-all duration-150 group-hover:mr-6" />
			Previous
		</button>
        <button onclick={onNext} class="bg-green-500 flex cursor-pointer items-center group justify-center rounded-full px-4 py-2 md:px-6 md:py-2 text-white shadow-lg">
            Submit
            <Icon icon="ph:arrow-right-bold" class="ml-2 md:ml-4 size-5 text-white transition-all duration-150 group-hover:ml-3 md:group-hover:ml-6" />
        </button>
    </div>
</div>
