<script>
	import { Input, Dropdown } from '$components';
	import Icon from '@iconify/svelte';

	let { shortlistedFields = $bindable(), errors, onNext, onPrevious, fieldsOfStudy } = $props();
	let selectionsLeft = $derived(1 - shortlistedFields.length);

	function toggleShortlist(field) {
		const index = shortlistedFields.indexOf(field);
		if (index === -1) {
			if (shortlistedFields.length < 1) {
				shortlistedFields = [...shortlistedFields, field];
			}
		} else {
			shortlistedFields = shortlistedFields.filter((val) => val !== field);
		}
	}
</script>

<div class="space-y-8 rounded-2xl bg-gray-50 p-4 md:p-8">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each fieldsOfStudy as field}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-400 bg-white p-4 hover:bg-gray-100 md:p-6"
				onclick={() => toggleShortlist(field)}>
				<div
					class="flex h-full w-full grow flex-col items-center justify-start space-y-4 md:flex-row md:space-y-0 md:space-x-4">
					<div class="flex flex-col space-y-2">
						<p class=" text-center md:text-left">{field.toUpperCase()}</p>
					</div>
				</div>

				<div class="flex w-full mt-2 md:mt-4 grow flex-col items-center justify-start md:flex-row">
					<div
						class="rounded-full {shortlistedFields.includes(field)
							? 'hidden'
							: ''} mt-4 cursor-pointer border-2 border-green-300 p-1 px-3 text-xs md:mt-0">
						<p class="z-50 tracking-tight text-gray-800">Select</p>
					</div>

                    {#if shortlistedFields.includes(field)}
                        <div class="rounded-full bg-green-300 p-1 px-3 text-xs mt-4 md:mt-0">
                            <p class="tracking-tight text-gray-800">Selected</p>
                        </div>
                    {/if}

				</div>
			</div>
		{/each}
	</div>
</div>
