<script>
	import { Input, DateInput, Dropdown } from "$components";
	import Icon from "@iconify/svelte";

	let { details, errors, onNext } = $props();
</script>

<div class="space-y-8 rounded-2xl bg-gray-50 p-4 md:p-8">
	<h2 class="text-3xl font-medium tracking-tight text-gray-800">Personal Information</h2>



	<Input label="Full Name" bind:value={details.fullName} icon="heroicons:user-circle" placeholder="John Doe" error={errors.fullName} />
	<Input type="email" label="Email" bind:value={details.email} icon="heroicons:envelope" placeholder="john.doe@example.com" error={errors.email} />

	<div class="flex space-x-4">
		<DateInput label="Date of Birth" bind:value={details.dob} error={errors.dob} />
		<Dropdown
			label="Gender"
			bind:value={details.gender}
			error={errors.gender}
			items={[
				{ value: 'Male', label: 'Male' },
				{ value: 'Female', label: 'Female' },
				{ value: 'Other', label: 'Other' }
			]}
		/>
	</div>

	<div class="flex space-x-4">
		<Input label="Nationality" bind:value={details.nationality} icon="heroicons:flag" placeholder="Indian" error={errors.nationality} />
		<Input type="tel" label="Phone" bind:value={details.phone} icon="heroicons:phone" placeholder="+91 98765 43210" error={errors.phone} />
	</div>

	<Input label="Address" bind:value={details.address} icon="heroicons:home" placeholder="123 Main St, City, Country" error={errors.address} />

	<button onclick={onNext} class="bg-secondary flex cursor-pointer items-center group justify-center rounded-full px-6 py-2 text-white shadow-lg">
		Next
		<Icon icon="heroicons:arrow-right" class="ml-4 size-5 text-white transition-all duration-150 group-hover:ml-6" />
	</button>
</div>