<script>
	import { Input, DateInput, Dropdown } from "$components";
	import Icon from "@iconify/svelte";

	let { documentDetails, errors, onNext } = $props();
</script>

<div class="space-y-12 rounded-2xl bg-gray-50 p-4 md:p-8">
	<h2 class="text-3xl font-medium tracking-tight text-gray-800">Document Submission</h2>

    <Input name="tenthMarksheet" uploadName="10th Marksheet" label="10th Marksheet" bind:value={documentDetails.tenthMarksheet} icon="heroicons:document" placeholder="10th Marksheet" type="file" accept=".pdf,.doc,.docx" />

    <Input name="twelvethMarksheet" uploadName="12th Marksheet" label="12th Marksheet" bind:value={documentDetails.twelvethMarksheet} icon="heroicons:document" placeholder="12th Marksheet" type="file" accept=".pdf,.doc,.docx" />

	<Input name="ugMarksheet" uploadName="UG Marksheet" label="UG Marksheet" required={false} bind:value={documentDetails.ugMarksheet} icon="heroicons:document" placeholder="UG Marksheet" type="file" accept=".pdf,.doc,.docx" />

	<!-- <Input name="ugMarksheet" label="UG Marksheet" bind:value={documentDetails.ugMarksheet} icon="heroicons:document" placeholder="UG Marksheet" type="file" accept=".pdf,.doc,.docx" /> -->

	<button onclick={onNext} class="bg-secondary flex cursor-pointer items-center group justify-center rounded-full px-6 py-2 text-white shadow-lg">
		Next
		<Icon icon="ph:arrow-right-bold" class="ml-4 size-5 text-white transition-all duration-150 group-hover:ml-6" />
	</button>
</div>