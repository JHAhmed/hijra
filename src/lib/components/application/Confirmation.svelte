<script>
	import Icon from "@iconify/svelte";

	// Receive all data and navigation functions as props
	let { details, academicDetails, documentDetails, onNext, onPrevious } = $props();

	// Helper to format the date object into a readable string
	function formatDate(date) {
		if (!date || !date.year) return "N/A";
		const day = String(date.day).padStart(2, "0");
		const month = String(date.month).padStart(2, "0");
		return `${date.year}-${month}-${day}`;
	}
</script>

<div class="space-y-6 rounded-2xl bg-gray-50 p-4 md:p-8">
	<h2 class="text-3xl font-medium tracking-tight text-gray-800">Review Your Application</h2>
	<p class="text-gray-600">Please review all the information carefully before submitting.</p>

	<div class="space-y-2 border-t border-gray-600 pt-4">
		<h3 class="text-xl mb-3 font-medium tracking-tight text-gray-700">Personal Information</h3>
		<p class="tracking-tight font-medium">Full Name: <span class="font-normal text-gray-900">{details.fullName}</span></p>
		<p class="tracking-tight font-medium">Email: <span class="font-normal text-gray-900">{details.email}</span></p>
		<p class="tracking-tight font-medium">Date of Birth: <span class="font-normal text-gray-900">{formatDate(details.dob)}</span></p>
		<p class="tracking-tight font-medium">Gender: <span class="font-normal text-gray-900">{details.gender}</span></p>
		<p class="tracking-tight font-medium">Nationality: <span class="font-normal text-gray-900">{details.nationality}</span></p>
		<p class="tracking-tight font-medium">Phone: <span class="font-normal text-gray-900">{details.phone}</span></p>
		<p class="tracking-tight font-medium">Address: <span class="font-normal text-gray-900">{details.address}</span></p>
	</div>

	<div class="space-y-2 border-t border-gray-600 pt-4">
		<h3 class="text-xl mb-3 font-medium tracking-tight text-gray-700">Academic Details</h3>
		<p class="tracking-tight font-medium">Highest Qualification: <span class="font-normal text-gray-900">{academicDetails.highestQualification}</span></p>
		<p class="tracking-tight font-medium">Graduation Year: <span class="font-normal text-gray-900">{academicDetails.graduationYear}</span></p>
		<p class="tracking-tight font-medium">Institution: <span class="font-normal text-gray-900">{academicDetails.institution}</span></p>
		<p class="tracking-tight font-medium">Education Board: <span class="font-normal text-gray-900">{academicDetails.educationBoard}</span></p>
		<p class="tracking-tight font-medium">Percentage: <span class="font-normal text-gray-900">{academicDetails.percentage}%</span></p>
	</div>

	<div class="space-y-2 border-t border-gray-600 pt-4">
		<h3 class="text-xl mb-3 font-medium tracking-tight text-gray-700">Submitted Documents</h3>
		<p class="tracking-tight font-medium">
			10th Marksheet:
			<span class="font-mono text-gray-800">
				{documentDetails.tenthMarksheet?.[0]?.name ?? 'Not provided'}
			</span>
		</p>
		<p class="tracking-tight font-medium">
			12th Marksheet:
			<span class="font-mono text-gray-800">
				{documentDetails.twelvethMarksheet?.[0]?.name ?? 'Not provided'}
			</span>
		</p>
	</div>

	<div class="flex flex-col md:flex-row space-y-2 md:space-y-0 space-x-2 border-t border-gray-600 pt-6">
		<button
			onclick={onPrevious}
			class="bg-secondary flex cursor-pointer items-center group justify-center rounded-full px-6 py-2 text-white shadow-lg"
		>
			<Icon icon="heroicons:arrow-left" class="mr-4 size-5 text-white transition-all duration-150 group-hover:mr-6" />
			Back to Edit
		</button>
		<button
			onclick={onNext}
			class="bg-green-600 hover:bg-green-700 flex cursor-pointer items-center group justify-center rounded-full px-6 py-2 text-white shadow-lg"
		>
			Confirm & Submit
			<Icon icon="heroicons:paper-airplane" class="ml-4 size-5 text-white transition-all duration-150 group-hover:ml-6" />
		</button>
	</div>
</div>