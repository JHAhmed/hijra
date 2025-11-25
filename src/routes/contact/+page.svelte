<script>
	import Button from '$components/ui/Button.svelte';
	import Input from '$components/ui/Input.svelte';
	import Dropdown from '$components/ui/Dropdown.svelte';
	import Icon from '@iconify/svelte';

	let formData = $state({
		name: '',
		email: '',
		phone: '',
		interest: '',
		message: ''
	});

	let errors = $state({});
	let loading = $state(false);
	let success = $state(false);

	const interests = [
		{ value: '', label: 'Select an option', disabled: true },
		{ value: 'hajj-2026', label: 'Hajj 2026' },
		{ value: 'umrah', label: 'Umrah Package' },
		{ value: 'group-tour', label: 'Group Tour' },
		{ value: 'custom-package', label: 'Custom Package' },
		{ value: 'general-inquiry', label: 'General Inquiry' }
	];

	function validateForm() {
		errors = {};
		let isValid = true;

		if (!formData.name.trim()) {
			errors.name = 'Name is required';
			isValid = false;
		}

		if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = 'Valid email is required';
			isValid = false;
		}

		if (!formData.phone.trim() || !/^\+?[\d\s()-]{10,}$/.test(formData.phone)) {
			errors.phone = 'Valid phone number is required';
			isValid = false;
		}

		if (!formData.interest) {
			errors.interest = 'Please select your interest';
			isValid = false;
		}

		if (!formData.message.trim()) {
			errors.message = 'Message is required';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit() {
		if (!validateForm()) return;

		loading = true;
		success = false;

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				success = true;
				formData = { name: '', email: '', phone: '', interest: '', message: '' };
				errors = {};

				// Reset success message after 5 seconds
				setTimeout(() => {
					success = false;
				}, 5000);
			} else {
				throw new Error('Submission failed');
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			errors.submit = 'Failed to send message. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<section class="w-full bg-white px-6 pt-16 pb-12 text-secondary md:px-12">
	<div class="mx-auto max-w-5xl text-center">
		<div class="animate-fade-in-up mb-6 flex translate-y-4 justify-center opacity-0">
			<span
				class="rounded-full border border-gray-100 bg-gray-50 px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase">
				Contact Us
			</span>
		</div>

		<h1
			class="animate-fade-in-up mb-8 translate-y-4 text-5xl leading-[1.1] font-semibold tracking-tighter text-secondary opacity-0 delay-100 md:text-7xl">
			Let's plan your <br class="hidden md:block" />
			<span class="text-primary">Sacred Journey.</span>
		</h1>

		<p
			class="animate-fade-in-up mx-auto max-w-2xl translate-y-4 text-lg leading-relaxed font-medium text-gray-500 opacity-0 delay-200 md:text-xl">
			Whether you are ready to book or just have a question about the requirements, our team is here
			to serve you.
		</p>
	</div>
</section>

<section class="w-full border-b border-gray-100 bg-white py-12 text-secondary md:py-16">
	<div class="mx-auto max-w-8xl px-6 md:px-12">
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
			<!-- Left Column: Contact Info -->
			<div class="flex flex-col justify-between gap-12 lg:col-span-5">
				<div>
					<span class="mb-4 block text-xs font-bold tracking-widest text-primary uppercase">
						Get In Touch
					</span>
					<h2 class="mb-6 text-4xl font-semibold tracking-tight text-secondary md:text-5xl">
						Speak to our <br />
						<span class="text-primary">support team.</span>
					</h2>
					<p class="text-lg leading-relaxed text-gray-500">
						Our dedicated support team in Jeddah is available 24/7 to assist you with any questions
						about your sacred journey.
					</p>
				</div>

				<div class="hidden space-y-8">
					<!-- Email -->
					<div class="group">
						<div class="mb-3 flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
								<Icon icon="heroicons:envelope-16-solid" class="h-5 w-5 text-primary" />
							</div>
							<span class="text-xs font-bold tracking-widest text-gray-400 uppercase">
								Email Address
							</span>
						</div>
						<a
							href="mailto:salam@hijrah.com"
							class="block text-2xl font-medium tracking-tight text-secondary transition-colors duration-200 hover:text-primary md:text-3xl">
							salam@hijrah.com
						</a>
					</div>

					<!-- Phone -->
					<div class="group">
						<div class="mb-3 flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
								<Icon icon="heroicons:phone-16-solid" class="h-5 w-5 text-primary" />
							</div>
							<span class="text-xs font-bold tracking-widest text-gray-400 uppercase">
								WhatsApp / Call
							</span>
						</div>
						<a
							href="tel:+966500000000"
							class="block text-2xl font-medium tracking-tight text-secondary transition-colors duration-200 hover:text-primary md:text-3xl">
							+966 50 000 0000
						</a>
					</div>

					<!-- Office Hours -->
					<div class="group">
						<div class="mb-3 flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
								<Icon icon="heroicons:clock-16-solid" class="h-5 w-5 text-primary" />
							</div>
							<span class="text-xs font-bold tracking-widest text-gray-400 uppercase">
								Office Hours
							</span>
						</div>
						<p class="text-xl font-medium tracking-tight text-secondary md:text-2xl">
							24/7 Support Available
						</p>
					</div>
				</div>
			</div>

			<!-- Right Column: Contact Form -->
			<div class="lg:col-span-7">
				{#if success}
					<div
						class="mb-6 rounded-lg border border-green-200 bg-green-50 p-6 transition-all duration-300">
						<div class="flex items-start gap-4">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
								<Icon icon="heroicons:check-circle-16-solid" class="h-6 w-6 text-green-600" />
							</div>
							<div>
								<h4 class="mb-1 font-bold text-green-900">Message Sent Successfully!</h4>
								<p class="text-sm text-green-800">
									Thank you for reaching out. We'll get back to you within 24 hours.
								</p>
							</div>
						</div>
					</div>
				{/if}

				{#if errors.submit}
					<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-6">
						<div class="flex items-start gap-4">
							<Icon
								icon="heroicons:exclamation-circle-16-solid"
								class="h-5 w-5 shrink-0 text-red-600" />
							<p class="text-sm text-red-800">{errors.submit}</p>
						</div>
					</div>
				{/if}

				<form onsubmit={handleSubmit} class="space-y-6">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<Input
							label="Full Name"
							name="name"
							type="text"
							bind:value={formData.name}
							placeholder="e.g., Yusuf Ahmed"
							icon="heroicons:user"
							error={errors.name}
							required />

						<Input
							label="Email Address"
							name="email"
							type="email"
							bind:value={formData.email}
							placeholder="name@example.com"
							icon="heroicons:envelope"
							error={errors.email}
							required />
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<Input
							label="Phone Number"
							name="phone"
							type="tel"
							bind:value={formData.phone}
							placeholder="+1 (555) 000-0000"
							icon="heroicons:phone"
							error={errors.phone}
							required />

						<Dropdown
							label="Interested In"
							name="interest"
							bind:value={formData.interest}
							items={interests}
							placeholder="Select an option"
							error={errors.interest} />
					</div>

					<div>
						<label for="message" class="mb-2 block text-sm font-medium text-secondary">
							Your Message
						</label>
						<textarea
							id="message"
							name="message"
							rows="5"
							bind:value={formData.message}
							placeholder="Tell us about your plans for Hajj or Umrah..."
							class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-secondary placeholder-gray-400 transition-colors duration-200 focus:border-primary focus:ring-0 focus:outline-none disabled:opacity-50"
							class:border-red-500={errors.message}></textarea>
						{#if errors.message}
							<p class="mt-1.5 flex items-center gap-1 text-xs text-red-500">
								<Icon icon="heroicons:exclamation-circle-16-solid" class="h-3.5 w-3.5" />
								{errors.message}
							</p>
						{/if}
					</div>

					<!-- Response Time Notice -->
					<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
						<div class="flex items-start gap-3">
							<Icon
								icon="heroicons:information-circle-16-solid"
								class="h-5 w-5 shrink-0 text-primary" />
							<p class="text-xs text-gray-600">
								We typically respond within 24 hours. For urgent inquiries, please call us directly
								at +966 50 000 0000.
							</p>
						</div>
					</div>

					<div class="pt-2">
						<Button
							type="submit"
							text={loading ? 'Sending...' : 'Send Message'}
							variant="primary"
							size="md"
							disabled={loading}
							fullWidth={true} />
					</div>
				</form>
			</div>
		</div>
	</div>
</section>

<style>
	.animate-fade-in-up {
		animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	.delay-100 {
		animation-delay: 0.1s;
	}
	.delay-200 {
		animation-delay: 0.2s;
	}
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
