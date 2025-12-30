<script>
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';
	import FileInput from '$components/ui/FileInput.svelte';
	import Button from '$components/ui/Button.svelte';
	import { authStore } from '$lib/auth.svelte';
	import { onMount } from 'svelte';

	let loading = $state(false);
	let receipt = $state(undefined);
	let error = $state('');
	let applicationId = $state(null);
	
	// Read-only state
	let isCompleted = $state(false);
	let isLoading = $state(true);

	// Mock Data
	const paymentDetails = {
		totalAmount: 450000,
		currency: 'INR',
		status: 'pending', // pending, verified, rejected
		dueDate: '2025-03-15',
		breakdown: [
			{ item: 'Hajj Package (Premium)', amount: 400000 },
			{ item: 'Visa Processing', amount: 30000 },
			{ item: 'Qurbani', amount: 20000 }
		]
	};

	const bankDetails = {
		bankName: 'Islamic Bank of India',
		accountName: 'Hijrah Travels Pvt Ltd',
		accountNumber: '123456789012',
		ifsc: 'IBI0001234',
		branch: 'Chennai Main Branch'
	};

	// Get application ID from user progress
	onMount(async () => {
		if (!authStore.user) {
			goto('/auth');
			return;
		}

		try {
			const response = await fetch(`/api/user/progress?userId=${authStore.user.$id}`);
			const data = await response.json();

			if (data.success && data.applicationId) {
				applicationId = data.applicationId;
				
				// Check if payment step is completed (currentStep >= 4)
				if (data.currentStep >= 4) {
					isCompleted = true;
				}
			} else {
				error = 'No application found. Please complete the previous steps.';
			}
		} catch (err) {
			console.error('Failed to fetch progress:', err);
			error = 'Failed to load payment details.';
		} finally {
			isLoading = false;
		}
	});

	async function handleSubmit() {
		if (!receipt || !applicationId) return;

		loading = true;
		error = '';

		try {
			const formData = new FormData();
			formData.append('applicationId', applicationId);
			formData.append('userId', authStore.user.$id);
			formData.append('receipt', receipt[0]); // FileInput returns a FileList

			const response = await fetch('/api/payments', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				// Navigate to success page
				goto('/hijrah-portal/application/success');
			} else {
				error = result.error || 'Failed to submit payment';
			}
		} catch (err) {
			console.error('Payment submission failed:', err);
			error = 'An error occurred while submitting your payment. Please try again.';
		} finally {
			loading = false;
		}
	}

	function formatCurrency(amount) {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Payment | Hijrah Portal</title>
</svelte:head>

{#if isCompleted}
	<!-- Read-Only View -->
	<div class="min-h-screen bg-gray-50/50 pt-10 pb-20 text-secondary">
		<div class="mx-auto max-w-4xl px-6">
			<div class="mb-8 text-center">
				<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
					<Icon icon="heroicons:check-circle-solid" class="h-5 w-5" />
					Payment Submitted
				</div>
				<h1 class="text-3xl font-semibold tracking-tighter md:text-5xl">
					Payment <span class="text-primary">Received</span>
				</h1>
				<p class="mt-4 text-gray-500">
					Your payment receipt has been submitted and is being processed.
				</p>
			</div>

			<div class="overflow-hidden rounded-3xl border border-green-200 bg-white p-8">
				<div class="mb-6 flex items-center gap-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
						<Icon icon="heroicons:banknotes" class="h-6 w-6 text-green-600" />
					</div>
					<div>
						<h3 class="font-bold text-secondary">Payment Under Verification</h3>
						<p class="text-sm text-gray-500">Our team is verifying your payment receipt</p>
					</div>
				</div>

				<div class="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-6">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Amount Paid</p>
							<p class="mt-1 text-2xl font-bold text-primary">{formatCurrency(paymentDetails.totalAmount)}</p>
						</div>
						<div>
							<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Status</p>
							<p class="mt-1 flex items-center gap-2 text-lg font-bold text-yellow-600">
								<Icon icon="heroicons:clock" class="h-5 w-5" />
								Pending Verification
							</p>
						</div>
					</div>
				</div>

				<div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
					<div class="flex items-center gap-3">
						<Icon icon="heroicons:document-check" class="h-8 w-8 text-green-500" />
						<div>
							<p class="font-medium text-secondary">Receipt Uploaded</p>
							<p class="text-xs text-gray-500">Your payment verification is in progress</p>
						</div>
					</div>
				</div>

				<div class="mt-8 flex justify-center">
					<Button href="/hijrah-portal" text="Back to Portal" variant="secondary" />
				</div>
			</div>
		</div>
	</div>
{:else}
<div class="min-h-screen bg-gray-50/50 pt-10 pb-20 text-secondary">
	<div class="mx-auto max-w-6xl px-6">
		<!-- Header -->
		<div class="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
			<div>
				<span class="mb-3 block text-xs font-bold tracking-widest text-primary uppercase">
					Payment
				</span>
				<h1 class="text-3xl font-semibold tracking-tighter md:text-5xl">
					Complete your <span class="text-primary">Payment.</span>
				</h1>
				<p class="mt-4 max-w-xl text-lg text-gray-500">
					Please transfer the total amount to the bank account below and upload your transaction
					receipt.
				</p>
			</div>

			<div class="hidden md:block">
				<div
					class="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-bold text-orange-700">
					<Icon icon="heroicons:clock" class="h-4 w-4" />
					Due by {new Date(paymentDetails.dueDate).toLocaleDateString('en-GB')}
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Left Column: Payment Info -->
			<div class="space-y-8 lg:col-span-2">
				<!-- Amount Card -->
				<div
					in:fade={{ delay: 50 }}
					class="overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
					<div class="mb-6 flex items-center justify-between">
						<h3 class="text-xl font-bold text-secondary">Payment Summary</h3>
						<span
							class="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold tracking-wide text-yellow-700 uppercase">
							{paymentDetails.status}
						</span>
					</div>

					<div class="mb-8 flex items-baseline gap-1">
						<span class="text-5xl font-bold tracking-tight text-secondary">
							{formatCurrency(paymentDetails.totalAmount)}
						</span>
						<span class="text-lg font-medium text-gray-400">Total</span>
					</div>

					<div class="space-y-4 rounded-2xl bg-gray-50 p-6">
						{#each paymentDetails.breakdown as item}
							<div class="flex justify-between text-sm">
								<span class="font-medium text-gray-600">{item.item}</span>
								<span class="font-bold text-secondary">{formatCurrency(item.amount)}</span>
							</div>
						{/each}
						<div class="my-2 border-t border-gray-200"></div>
						<div class="flex justify-between text-base">
							<span class="font-bold text-secondary">Total Payable</span>
							<span class="font-bold text-primary"
								>{formatCurrency(paymentDetails.totalAmount)}</span>
						</div>
					</div>
				</div>

				<!-- Bank Details Card -->
				<div
					in:fade={{ delay: 100 }}
					class="overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
					<div class="mb-6 flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
							<Icon icon="ph:bank-fill" class="h-5 w-5" />
						</div>
						<h3 class="text-xl font-bold text-secondary">Bank Transfer Details</h3>
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div class="space-y-1">
							<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Bank Name</p>
							<p class="text-lg font-medium text-secondary">{bankDetails.bankName}</p>
						</div>
						<div class="space-y-1">
							<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Account Name</p>
							<p class="text-lg font-medium text-secondary">{bankDetails.accountName}</p>
						</div>
						<div class="space-y-1">
							<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">Account Number</p>
							<p class="font-mono text-lg font-medium tracking-wide text-secondary">
								{bankDetails.accountNumber}
							</p>
						</div>
						<div class="space-y-1">
							<p class="text-xs font-bold tracking-wider text-gray-400 uppercase">IFSC Code</p>
							<p class="font-mono text-lg font-medium tracking-wide text-secondary">
								{bankDetails.ifsc}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Column: Upload -->
			<div class="lg:col-span-1">
				<div
					in:fade={{ delay: 150 }}
					class="sticky top-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
					<h3 class="mb-2 text-xl font-bold text-secondary">Upload Receipt</h3>
					<p class="mb-8 text-sm text-gray-500">
						Once you have made the transfer, please upload the transaction receipt or screenshot
						here.
					</p>

					<div class="space-y-6">
						<FileInput
							label="Transaction Receipt"
							icon="ph:receipt"
							uploadName="Payment_Receipt"
							accept=".jpg,.png,.pdf"
							bind:value={receipt} />

						<div class="pt-4">
							<Button
								size="lg"
								fullWidth
								onclick={handleSubmit}
								{loading}
								disabled={!receipt || !applicationId}
								variant="primary"
								text="Submit Payment" />
						</div>

						{#if error}
							<div class="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
								<Icon icon="heroicons:exclamation-circle" class="mb-1 inline h-4 w-4" />
								{error}
							</div>
						{/if}

						<p class="text-center text-xs text-gray-400">
							Your payment status will be updated within 24 hours of submission.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
{/if}

