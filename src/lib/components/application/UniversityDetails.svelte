<script>
    import { Input, Dropdown } from "$components";
    import Icon from "@iconify/svelte";

    let { shortlisted = $bindable(), errors, onNext, onPrevious, universities, universityDetails } = $props();
    let selectionsLeft = $derived(6 - shortlisted.length);
    
    // Country filter state
    let selectedCountry = $state('all');

    // Extract unique countries from universities
    let uniqueCountries = $derived.by(() => {
        return [...new Set(universities.map(u => u.country))].sort();
    });

    let finalUniversities = $derived.by(() => {
        let final = [...universities];

        // Apply country filter
        if (selectedCountry !== 'all') {
            final = final.filter(uni => uni.country === selectedCountry);
        }

        // Exclude rejected universities
        if (universityDetails.rejectedUniversities && universityDetails.rejectedUniversities.length > 0) {
            final = final.filter(uni => !universityDetails.rejectedUniversities.includes(uni.id));
        }

        return final;
    })

    function toggleShortlist(uniId) {
        const index = shortlisted.indexOf(uniId);
        if (index === -1) {
            if (shortlisted.length < 6) {
                shortlisted = [...shortlisted, uniId];
            }
        } else {
            shortlisted = shortlisted.filter(val => val !== uniId);
        }
    }
</script>

<div class="space-y-8 rounded-2xl bg-gray-50 p-4 md:p-8">


    
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">



        <h2 class="text-xl md:text-3xl font-medium tracking-tight text-gray-800">
            University Selection <span class="text-gray-600">({selectionsLeft} left)</span>
        </h2>

        <!-- Country Filter Dropdown -->
        <div class="w-full sm:w-64">
            <label for="country-filter" class="sr-only">Filter by Country</label>
            <select
                id="country-filter"
                bind:value={selectedCountry}
                class="w-full rounded-lg border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option value="all">All Countries ({universities.length})</option>
                {#each uniqueCountries as country}
                    <option value={country}>
                        {country} ({universities.filter(u => u.country === country).length})
                    </option>
                {/each}
            </select>
        </div>
    </div>

    <!-- Results count -->
    {#if finalUniversities.length === 0}
        <div class="text-center py-12">
            <Icon icon="heroicons:magnifying-glass" class="mx-auto size-12 text-gray-400 mb-4" />
            <p class="text-gray-600">No universities found for the selected country.</p>
        </div>
    {:else}
        <p class="text-sm text-gray-600">
            Showing {finalUniversities.length} {finalUniversities.length === 1 ? 'university' : 'universities'}
        </p>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {#each finalUniversities as uni}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div 
                    class="flex flex-col items-center justify-center p-4 md:p-6 bg-white hover:bg-gray-100 rounded-lg border border-gray-400 cursor-pointer"
                    onclick={() => toggleShortlist(uni.id)}
                >

                    <div class="flex flex-col md:flex-row grow h-full w-full space-y-4 md:space-y-0 md:space-x-4 items-center justify-start ">
                        
                        <div class="w-24 h-24 ">
                            <img src={uni.image.url} alt="{uni.name}" class="w-24 h-24 object-cover rounded-lg mb-2 md:mb-0" />
                        </div>
                        

                        <div class="flex flex-col space-y-2">
                            <p class=" text-center md:text-left">{uni.name}</p>
                            <!-- <p class="text-sm text-gray-600  text-center md:text-left">MBBS</p> -->
                            <p class="text-sm text-gray-600  text-center md:text-left">{uni.fieldOfStudy.join(', ').toUpperCase()}</p>
                        </div>

                    </div>

                    <div class="px-4 my-4 h-px w-full bg-gray-400"></div>

                    <div class="flex flex-col grow w-full md:flex-row items-center justify-start ">
                        <div class="flex items-center justify-start grow">
                            <div class="w-0.5 flex h-4 bg-gray-300 mx-2"></div>
                            <p class="text-sm py-1  text-gray-600 text-center md:text-left">Tuition Fees: <span class="text-black">₽{uni.fees.toLocaleString()}</span></p>
                        </div>

                        <div class="rounded-full {shortlisted.includes(uni.id) ? "hidden" : ""} border-2 cursor-pointer border-green-300 p-1 px-3 text-xs mt-4 md:mt-0">
                            <p class="tracking-tight text-gray-800 z-50">Shortlist</p>
                        </div>

                        {#if shortlisted.includes(uni.id)}
                            <div class="rounded-full bg-green-300 p-1 px-3 text-xs mt-4 md:mt-0">
                                <p class="tracking-tight text-gray-800">Shortlisted</p>
                            </div>
                        {/if}

                    </div>
                </div>
            {/each}
        </div>
    {/if}

    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <button onclick={onNext} class="bg-secondary flex cursor-pointer items-center group justify-center rounded-full px-4 py-2 md:px-6 md:py-2 text-white shadow-lg">
            Next
            <Icon icon="heroicons:arrow-right" class="ml-2 md:ml-4 size-5 text-white transition-all duration-150 group-hover:ml-3 md:group-hover:ml-6" />
        </button>
    </div>
</div>
