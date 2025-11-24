<script>
	import Button from '$components/ui/Button.svelte';
	import Icon from '@iconify/svelte';

	let formData = {
		name: '',
		email: '',
		phone: '',
		interest: 'Hajj Package',
		message: ''
	};

	const interests = ['Hajj Package', 'Umrah Package', 'Custom Tour', 'Visa Only'];

	const handleSubmit = () => {
		console.log('Form Submitted', formData);
	};
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

<section
	class="w-full border-b border-gray-100 bg-white px-6 py-12 text-secondary md:px-12 md:py-24">
	<div class="mx-auto max-w-8xl">
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24">
			<div class="flex flex-col gap-16 lg:col-span-5">
				<div>
					<h3 class="mb-4 text-3xl leading-snug font-semibold tracking-tighter md:text-4xl">
						Get in touch <br />
						<span class="text-primary">directly.</span>
					</h3>
					<p class="max-w-sm text-lg leading-relaxed font-medium text-gray-500">
						Prefer to speak to a human? Our support team in Jeddah is available 24/7 to assist you.
					</p>
				</div>

				<div class="flex flex-col gap-10">
					<div class="group cursor-default">
						<div class="mb-2 flex items-center gap-3">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Icon icon="heroicons:envelope" class="h-4 w-4" />
							</div>
							<span class="text-xs font-bold tracking-widest text-gray-400 uppercase"
								>Email Address</span>
						</div>
						<a
							href="mailto:salam@hijrah.com"
							class="block text-2xl font-medium tracking-tight break-all text-secondary transition-colors hover:text-primary md:text-3xl">
							salam@hijrah.com
						</a>
					</div>

					<div class="group cursor-default">
						<div class="mb-2 flex items-center gap-3">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Icon icon="heroicons:phone" class="h-4 w-4" />
							</div>
							<span class="text-xs font-bold tracking-widest text-gray-400 uppercase"
								>WhatsApp / Call</span>
						</div>
						<a
							href="tel:+966500000000"
							class="block text-2xl font-medium tracking-tight text-secondary transition-colors hover:text-primary md:text-3xl">
							+966 50 000 0000
						</a>
					</div>
				</div>
			</div>

			<div class="lg:col-span-7">
				<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-8 bg-white pt-2">
					<div class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
						<div class="flex flex-col gap-2">
							<label for="name" class="text-xs font-bold tracking-widest text-gray-400 uppercase"
								>Full Name</label>
							<input
								type="text"
								id="name"
								placeholder="e.g. Yusuf Ahmed"
								bind:value={formData.name}
								class="w-full border-b border-gray-200 bg-transparent py-4 text-lg font-medium text-secondary placeholder-gray-300 transition-colors focus:border-primary focus:outline-none" />
						</div>
						<div class="flex flex-col gap-2">
							<label for="email" class="text-xs font-bold tracking-widest text-gray-400 uppercase"
								>Email Address</label>
							<input
								type="email"
								id="email"
								placeholder="name@example.com"
								bind:value={formData.email}
								class="w-full border-b border-gray-200 bg-transparent py-4 text-lg font-medium text-secondary placeholder-gray-300 transition-colors focus:border-primary focus:outline-none" />
						</div>
					</div>

					<div class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
						<div class="flex flex-col gap-2">
							<label for="phone" class="text-xs font-bold tracking-widest text-gray-400 uppercase"
								>Phone Number</label>
							<input
								type="tel"
								id="phone"
								placeholder="+1 (555) 000-0000"
								bind:value={formData.phone}
								class="w-full border-b border-gray-200 bg-transparent py-4 text-lg font-medium text-secondary placeholder-gray-300 transition-colors focus:border-primary focus:outline-none" />
						</div>
						<div class="relative flex flex-col gap-2">
							<label
								for="interest"
								class="text-xs font-bold tracking-widest text-gray-400 uppercase"
								>Interested In</label>
							<div class="relative">
								<select
									id="interest"
									bind:value={formData.interest}
									class="w-full cursor-pointer appearance-none rounded-none border-b border-gray-200 bg-transparent py-4 text-lg font-medium text-secondary transition-colors focus:border-primary focus:outline-none">
									{#each interests as interest}
										<option value={interest}>{interest}</option>
									{/each}
								</select>
								<div class="pointer-events-none absolute top-5 right-0 text-gray-400">
									<Icon icon="heroicons:chevron-down" class="h-5 w-5" />
								</div>
							</div>
						</div>
					</div>

					<div class="flex flex-col gap-2">
						<label for="message" class="text-xs font-bold tracking-widest text-gray-400 uppercase"
							>Your Message</label>
						<textarea
							id="message"
							rows="4"
							placeholder="Tell us about your plans..."
							bind:value={formData.message}
							class="w-full resize-none border-b border-gray-200 bg-transparent py-4 text-lg font-medium text-secondary placeholder-gray-300 transition-colors focus:border-primary focus:outline-none"
						></textarea>
					</div>

					<div class="pt-6">
						<Button
							type="submit"
							text="Send Message"
							variant="primary"
							size="md"
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
