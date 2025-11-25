<script>
	import { goto } from '$app/navigation';
	import { fade, slide } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';

	// UI Components
	import Button from '$components/ui/Button.svelte';
	import Input from '$components/ui/Input.svelte';
	import Dropdown from '$components/ui/Dropdown.svelte';
	import DateField from '$components/ui/DateField.svelte';
	import { cn } from '$lib/utils.js';

	// State Management
	let step = $state(1);
	let loading = $state(false);
	let errors = $state({});

	// Get Package ID from URL (since step 1 is removed)
	const packageId = $derived($page.url.searchParams.get('packageId') || 'unknown-package');

	const relationships = [
		{ value: 'spouse', label: 'Spouse' },
		{ value: 'child', label: 'Child' },
		{ value: 'parent', label: 'Parent' },
		{ value: 'sibling', label: 'Sibling' }
	];

	// Form Data Store
	let formData = $state({
		packageId: packageId,
		leadPilgrim: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			gender: '',
			dob: undefined,
			passportNumber: '',
			passportExpiry: undefined
		},
		familyMembers: []
	});

	// Helper: Add Family Member
	function addFamilyMember() {
		if (formData.familyMembers.length < 9) {
			formData.familyMembers.push({
				firstName: '',
				lastName: '',
				relation: '',
				passportNumber: '',
				dob: undefined
			});
		}
	}

	// Helper: Remove Family Member
	function removeFamilyMember(index) {
		formData.familyMembers = formData.familyMembers.filter((_, i) => i !== index);
	}

	// Validation Logic
	function validateStep(currentStep) {
		let newErrors = {};
		let isValid = true;

		// Step 1: Personal Details
		if (currentStep === 1) {
			const required = ['firstName', 'lastName', 'email', 'phone', 'passportNumber'];
			required.forEach((field) => {
				if (!formData.leadPilgrim[field]) {
					newErrors[field] = 'This field is required';
					isValid = false;
				}
			});
		}

		// Step 2: Family (Optional, but check fields if added)
		if (currentStep === 2) {
			// Add specific validation for family members here if needed
		}

		errors = newErrors;
		return isValid;
	}

	// Navigation
	function nextStep() {
		if (validateStep(step)) {
			step++;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function prevStep() {
		if (step > 1) step--;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	async function handleSubmit() {
		loading = true;
		// Simulate Backend Call -> Redirect to Documents or Success
		setTimeout(() => {
			loading = false;
			goto('/hijrah-portal/documents'); // Logic change: Maybe go to docs page next?
		}, 1500);
	}
</script>

<div class="min-h-screen bg-gray-50/50 pt-10 pb-20 text-secondary">
	<div class="mx-auto max-w-4xl px-6">
		<div class="mb-10 text-center">
			<span class="mb-3 block text-xs font-bold tracking-widest text-primary uppercase">
				Application Form
			</span>
			<h1 class="text-3xl font-semibold tracking-tighter md:text-5xl">
				Pilgrim <span class="text-primary">Details.</span>
			</h1>
		</div>

		<div class="mb-12 flex items-center justify-between px-4 md:px-20">
			{#each ['Personal Info', 'Family Members', 'Review & Submit'] as label, i}
				{@const stepNum = i + 1}
				<div class="relative z-10 flex flex-col items-center gap-2">
					<div
						class={cn(
							'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300',
							step >= stepNum
								? 'border-primary bg-primary text-white'
								: 'border-gray-200 bg-white text-gray-300'
						)}>
						{#if step > stepNum}
							<Icon icon="heroicons:check" class="h-4 w-4" />
						{:else}
							{stepNum}
						{/if}
					</div>
					<span
						class={cn(
							'hidden text-xs font-medium sm:block',
							step >= stepNum ? 'text-secondary' : 'text-gray-400'
						)}>{label}</span>
				</div>
				{#if i < 2}
					<div class="relative -z-0 mx-2 -mt-6 h-0.5 w-full bg-gray-200">
						<div
							class="absolute inset-0 bg-primary transition-all duration-500"
							style="width: {step > stepNum ? '100%' : '0%'}">
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<div
			class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/40">
			{#if step === 1}
				<div in:fade={{ duration: 300 }} class="p-6 md:p-10">
					<h2 class="mb-6 text-2xl font-bold tracking-tight">Lead Pilgrim Details</h2>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<Input
							label="First Name"
							bind:value={formData.leadPilgrim.firstName}
							error={errors.firstName} />
						<Input
							label="Last Name"
							bind:value={formData.leadPilgrim.lastName}
							error={errors.lastName} />

						<Input
							label="Email Address"
							type="email"
							icon="heroicons:envelope"
							bind:value={formData.leadPilgrim.email}
							error={errors.email} />
						<Input
							label="Phone Number"
							type="tel"
							icon="heroicons:phone"
							bind:value={formData.leadPilgrim.phone}
							error={errors.phone} />

						<Dropdown
							label="Gender"
							items={[
								{ value: 'male', label: 'Male' },
								{ value: 'female', label: 'Female' }
							]}
							bind:value={formData.leadPilgrim.gender} />
						<DateField label="Date of Birth" bind:value={formData.leadPilgrim.dob} />

						<div class="col-span-1 my-2 border-t border-gray-100 md:col-span-2"></div>

						<Input
							label="Passport Number"
							icon="heroicons:identification"
							bind:value={formData.leadPilgrim.passportNumber}
							error={errors.passportNumber} />
						<DateField
							label="Passport Expiry Date"
							bind:value={formData.leadPilgrim.passportExpiry} />
					</div>
				</div>
			{/if}

			{#if step === 2}
				<div in:fade={{ duration: 300 }} class="min-h-[500px] bg-gray-50/50 p-6 md:p-10">
					<div class="mb-6 flex items-center justify-between">
						<div>
							<h2 class="text-2xl font-bold tracking-tight">Family Members</h2>
							<p class="mt-1 text-sm text-gray-500">
								Add details for spouse, children, or parents.
							</p>
						</div>
						<Button
							onclick={addFamilyMember}
							disabled={formData.familyMembers.length >= 9}
							variant="secondary"
							size="sm"
							icon="heroicons:plus"
							text="Add Member" />
					</div>

					{#if formData.familyMembers.length === 0}
						<div
							class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
							<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
								<Icon icon="ph:users-three" class="h-6 w-6 text-gray-400" />
							</div>
							<p class="font-medium text-gray-500">No family members added yet.</p>
							<p class="mt-1 text-xs text-gray-400">You can skip this step if traveling alone.</p>
						</div>
					{:else}
						<div class="space-y-6">
							{#each formData.familyMembers as member, i}
								<div
									transition:slide
									class="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
									<div
										class="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
										<button
											onclick={() => removeFamilyMember(i)}
											class="p-1 text-red-400 hover:text-red-600">
											<Icon icon="heroicons:trash" class="h-5 w-5" />
										</button>
									</div>
									<h3 class="mb-4 text-sm font-bold tracking-wider text-primary uppercase">
										Member {i + 1}
									</h3>
									<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
										<Input label="First Name" bind:value={member.firstName} />
										<Input label="Last Name" bind:value={member.lastName} />
										<Dropdown
											label="Relationship"
											items={relationships}
											bind:value={member.relation} />
										<Input label="Passport Number" bind:value={member.passportNumber} />
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			{#if step === 3}
				<div in:fade={{ duration: 300 }} class="p-6 md:p-10">
					<h2 class="mb-8 text-2xl font-bold tracking-tight">Review Application</h2>
					<div class="space-y-8">
						<div>
							<h3 class="mb-4 text-sm font-bold tracking-widest text-gray-400 uppercase">
								Lead Pilgrim
							</h3>
							<div class="grid grid-cols-2 gap-6 text-sm md:grid-cols-3">
								<div>
									<span class="block text-gray-500">Name</span><span class="font-medium"
										>{formData.leadPilgrim.firstName} {formData.leadPilgrim.lastName}</span>
								</div>
								<div>
									<span class="block text-gray-500">Email</span><span class="font-medium"
										>{formData.leadPilgrim.email}</span>
								</div>
								<div>
									<span class="block text-gray-500">Passport</span><span class="font-medium"
										>{formData.leadPilgrim.passportNumber}</span>
								</div>
							</div>
						</div>

						{#if formData.familyMembers.length > 0}
							<div class="border-t border-gray-100 pt-6">
								<h3 class="mb-4 text-sm font-bold tracking-widest text-gray-400 uppercase">
									Family Members ({formData.familyMembers.length})
								</h3>
								<ul class="list-inside list-disc space-y-1 text-sm text-secondary">
									{#each formData.familyMembers as member}
										<li>
											{member.firstName}
											{member.lastName} <span class="text-gray-400">({member.relation})</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<div
				class="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 p-6 md:px-10 md:py-8">
				<Button onclick={prevStep} disabled={step === 1 || loading} variant="ghost" text="Back" />

				{#if step < 3}
					<Button
						onclick={nextStep}
						variant="primary"
						text="Continue"
						icon="heroicons:arrow-right" />
				{:else}
					<Button
						onclick={handleSubmit}
						{loading}
						variant="primary"
						text="Submit & Upload Documents"
						class="w-auto" />
				{/if}
			</div>
		</div>
	</div>
</div>
