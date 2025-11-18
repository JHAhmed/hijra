<script>
	// import { ImageCallCTA } from '$lib';
	import { Input, Button } from '$components';
	import { Separator } from 'bits-ui';
	import { toast, Toaster } from 'svelte-sonner';

	import Dropdown from './ui/Dropdown.svelte';
	import PhoneInput from './ui/PhoneInput.svelte';

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let countryCode = $state('+91');

	async function onclick() {
		if (name && email && phone && countryCode) {
			try {
				const response = await fetch('/api/send-email', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name, email, phone, countryCode, cta: true })
				});

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				toast.success('Thank you, ${name}. <br> We will contact you soon!');
			} catch (error) {
				console.error('Error sending email:', error);
			} finally {
				name = '';
				email = '';
				phone = '';
			}
		} else {
			toast('Please fill all the fields');
		}
	}
</script>

<Toaster closeButton position="bottom-right" />

<div
	class="mx-4 flex max-w-7xl flex-col items-center justify-center rounded-3xl bg-gray-100 sm:mx-8 md:mx-12 lg:mx-24 lg:flex-row">
	<div class="order-2 w-full p-4 sm:p-6 lg:order-1 lg:w-2/3 lg:p-12">
		<div class="mb-6 space-y-4 lg:mb-12">
			<h6 class="text-3xl font-light tracking-tighter sm:text-4xl lg:text-5xl">
				<span class="font-semibold">Confused?</span> Talk To A Consultant
			</h6>
			<p class="text-base font-normal text-gray-600 sm:text-lg lg:text-xl">
				Available Between Mon to Sat, 10:00 AM to 6:00 PM IST
			</p>
		</div>

		<div class="space-y-4 lg:space-y-6">
			<div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
				<Input
					bind:value={name}
					icon="heroicons:user-circle"
					placeholder="Name"
					type="text"
					class="w-full" />
				<Input
					bind:value={email}
					icon="heroicons:envelope"
					placeholder="Email"
					type="email"
					class="w-full" />
			</div>
			<div class="w-full space-y-6 md:w-1/2 md:pr-3">
				<!-- <Input bind:value={countryCode} icon="heroicons:globe-alt" placeholder="Country Code" type="text" /> -->
				<PhoneInput bind:value={phone} bind:countryCode label=""  />
				<!-- <Input bind:value={phone} icon="heroicons:phone" placeholder="Phone" type="tel" /> -->
			</div>
			<Button {onclick} text="Get Started" icon="ph:arrow-right-bold" width="w-full md:w-1/4" />
		</div>
	</div>

	<div class="order-1 w-full lg:order-2 lg:w-1/3">
		<img
			src="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=1170&auto=format&fit=crop"
			alt=""
			class="aspect-video h-auto w-full rounded-3xl object-cover p-4 lg:aspect-square xl:p-0" />
	</div>
</div>
