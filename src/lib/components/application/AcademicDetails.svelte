<script>
	import { Input, Dropdown } from "$components";
	import Icon from "@iconify/svelte";

	let { academicDetails, errors, onNext, onPrevious } = $props();
</script>

<div class="space-y-8 rounded-2xl bg-gray-50 p-4 md:p-8">
	<h2 class="text-3xl font-medium tracking-tight text-gray-800">Academic Details</h2>

	<Input label="Institution" bind:value={academicDetails.institution} icon="heroicons:building-library" placeholder="Your Institution" error={errors.institution} />

	<div class="flex flex-col md:flex-row md:space-y-0 space-x-4 space-y-4">
		<Dropdown
			label="Highest Qualification"
			bind:value={academicDetails.highestQualification}
			error={errors.highestQualification}
			items={[
				{ value: 'high_school', label: 'High School' },
				{ value: 'bachelor', label: "Bachelor's Degree" },
				{ value: 'master', label: "Master's Degree" },
				{ value: 'phd', label: 'PhD' }
			]}
		/>

		<Dropdown
			label="Graduation Year"
			bind:value={academicDetails.graduationYear}
			error={errors.graduationYear}
			items={[
				{ value: '2020', label: '2020' },
				{ value: '2021', label: '2021' },
				{ value: '2022', label: '2022' },
				{ value: '2023', label: '2023' },
				{ value: '2024', label: '2024' },
				{ value: '2025', label: '2025' }
			]}
		/>
	</div>

	<div class="flex flex-col md:flex-row md:space-y-0 space-x-4 space-y-4">
		<Dropdown
			label="Education Board"
			bind:value={academicDetails.educationBoard}
			error={errors.educationBoard}
			items={[
				{ value: 'cbse', label: 'CBSE' },
				{ value: 'icse', label: 'ICSE' },
				{ value: 'state_board', label: 'State Board' },
				{ value: 'ib', label: 'International Baccalaureate' }
			]}
		/>
		<Input type="number" min={0} max={100} label="Percentage" bind:value={academicDetails.percentage} icon="heroicons:percent-badge" placeholder="85" error={errors.percentage} />
	</div>

	<div class="flex flex-col md:flex-row md:space-y-0 space-x-4 space-y-4">
		<button onclick={onPrevious} class="bg-secondary flex cursor-pointer items-center group justify-center rounded-full px-6 py-2 text-white shadow-lg">
			<Icon icon="heroicons:arrow-left" class="mr-4 size-5 text-white transition-all duration-150 group-hover:mr-6" />
			Previous
		</button>
		<button onclick={onNext} class="bg-secondary flex cursor-pointer items-center group justify-center rounded-full px-6 py-2 text-white shadow-lg">
			Next
			<Icon icon="ph:arrow-right-bold" class="ml-4 size-5 text-white transition-all duration-150 group-hover:ml-6" />
		</button>
	</div>
</div>