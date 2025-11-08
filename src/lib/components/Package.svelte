<script>
    import { Accordion } from 'bits-ui';
    import { slide } from 'svelte/transition';

    let { travelPackage } = $props();

    export function formatIndian(num) {
        const str = num.toString();
        const lastThree = str.substring(str.length - 3);
        const otherNumbers = str.substring(0, str.length - 3);
        if (otherNumbers === '') return lastThree;
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength) + '...';
    }

    function toTitleCase(s) {
        return s.toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
    }
</script>

<Accordion.Item value={travelPackage.name} class="border-b border-gray-200 pb-4">
    <div class="flex flex-col">

        <h2
            class="group-hover:text-primary-dark mb-2 line-clamp-2 md:line-clamp-3 min-h-[2.5rem] text-sm font-semibold tracking-widest text-primary uppercase transition-colors md:min-h-[3rem] md:text-base">
            {travelPackage.name}
        </h2>

        <img
            src={travelPackage.image.url}
            loading="lazy"
            alt={`Image of ${travelPackage.name}`}
            class="mb-4 aspect-video h-32 w-full rounded-2xl object-cover md:h-64" />

        <p class="text-sm font-normal tracking-tight text-gray-800 md:text-xl">
            travelPackage Type: <span class="font-medium">{travelPackage.type}</span> | Duration: <span class="font-medium">{travelPackage.duration} Days</span>
        </p>

        <p class="mt-2 text-sm text-gray-600 md:text-base">
            Price: <span class="font-medium">₹{formatIndian(travelPackage.price)}</span> per person
        </p>

        <p class="mt-2 text-sm text-gray-600 md:text-base">
            Accommodation: <span class="font-medium">{travelPackage.accommodation.makkah} in Makkah | {travelPackage.accommodation.madinah} in Madinah</span>
        </p>

        <p class="mt-2 text-sm text-gray-600 md:text-base">
            Inclusions: <span class="font-medium">{toTitleCase(travelPackage.inclusions.join(', '))}</span>
        </p>

        <Accordion.Trigger
            class="hover:text-primary-dark mt-4 inline-flex items-center text-sm font-medium text-primary">
            Learn More
        </Accordion.Trigger>

        <Accordion.Content
            forceMount={true}
            class="overflow-hidden transition-all data-[closed]:max-h-0 data-[open]:max-h-[999px]">
            {#snippet child({ props, open })}
                {#if open}
                    <div {...props} transition:slide={{ duration: 300 }}>
                        <p class="mt-4 text-xs text-gray-600 md:text-sm">
                            {travelPackage.description}
                        </p>

                        {#if travelPackage.highlights && travelPackage.highlights.length > 0}
                            <div class="mt-4">
                                <p class="text-xs font-semibold text-gray-700 md:text-sm">travelPackage Highlights:</p>
                                <ul class="mt-2 list-disc pl-5 text-xs text-gray-600 md:text-sm">
                                    {#each travelPackage.highlights as highlight}
                                        <li>{highlight}</li>
                                    {/each}
                                </ul>
                            </div>
                        {/if}
                    </div>
                {/if}
            {/snippet}
        </Accordion.Content>
    </div>
</Accordion.Item>
