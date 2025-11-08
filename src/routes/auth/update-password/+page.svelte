<script>
	// import { user } from '$lib/unused/user.svelte.js';
	import favicon from '$lib/assets/favicon.svg';

	import { z } from 'zod';
	import { page } from '$app/state';
	import { auth } from '$lib/auth.svelte';
	import { blur } from 'svelte/transition';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast, Toaster } from 'svelte-sonner';
	
	import Icon from '@iconify/svelte';
	import Input from '$components/ui/Input.svelte';

	let errors = $state({});
	let loading = $state(false);

	let data = $state({
		email: '',
		name: ''
	});

	const detailsSchema = z.object({
		email: z.string().email('Please enter a valid email'),
		name: z.string().min(2, 'Name must be at least 2 characters long')
	});

	async function handleSubmit(e) {
		e.preventDefault();
		loading = true;
		errors = {};

		const result = detailsSchema.safeParse(data);

		if (!result.success) {
			result.error.issues.forEach((issue) => {
				errors[issue.path[0]] = issue.message;
			});
			toast.error('Please fix the errors before proceeding.');
			loading = false;
			return;
		}

		try {
			const response = await fetch('/api/request-password-reset', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: data.name, email: data.email })
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			toast.success(`Thank you, ${data.name}. <br> We will contact you soon!`);
		} catch (error) {
			console.error('Error sending email:', error);
		} finally {
			data.name = '';
			data.email = '';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Update Password | Hijra</title>
	<meta name="description" content="Request a new password for your Hijra account." />
	<link rel="canonical" href="https://hijra-portal.vercel.app/auth/update-password" />
	<script type="application/ld+json">
		{
			"@context": "http://schema.org",
			"@type": "WebPage",
			"name": "Update Password | Hijra",
			"url": "https://hijra-portal.vercel.app/auth/update-password"
		}
	</script>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Update Password | Hijra" />
	<meta property="og:image" content="{page.url.origin}/ogimage.png" />
	<meta property="og:url" content="{page.url.origin}/auth/update-password" />
	<meta
		property="og:description"
		content="Request a new password for your Hijra account." />
</svelte:head>

<Toaster richColors />

<div class="grid min-h-screen grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-2 md:p-8">
	<div class="mt-4 p-6 md:mt-8">
		<a href="/"><img src={favicon} alt="" class="mx-auto mb-8 h-10 sm:mb-12" /></a>

		<form class="space-y-4 sm:space-y-6" onsubmit={handleSubmit}>
			<div
				class="mx-auto mb-6 flex w-full flex-col items-start justify-center space-y-2 sm:mb-8 md:px-8 lg:px-20">
				<h2 class="self-start text-2xl font-light tracking-tight text-gray-700 sm:text-3xl">
					Reset Password
				</h2>
				<p class="self-start text-sm font-light text-gray-500">
					Please enter your email to reset your password.
				</p>
			</div>

			<div
				class="mx-auto flex w-full flex-col items-center justify-center space-y-4 sm:space-y-6 md:px-8 lg:px-20">
				<Input
					icon="heroicons:envelope"
					error={errors.name}
					label="Name"
					type="name"
					name="name"
					id="name"
					placeholder="Enter your name"
					bind:value={data.name} />

				<Input
					icon="heroicons:envelope"
					error={errors.email}
					label="Email"
					type="email"
					name="email"
					id="email"
					placeholder="Enter your email"
					bind:value={data.email} />

				<button
					type="submit"
					class="{loading
						? 'cursor-not-allowed opacity-70'
						: ''} w-full cursor-pointer rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
					>Request Password Reset</button>
				<p class="self-start text-left text-xs">
					Already have an account? <button
						type="button"
						onclick={() => (authType = 'login')}
						class="cursor-pointer text-primary hover:underline">Login</button>
				</p>
			</div>
		</form>
	</div>

	<div
		class="hidden flex-col items-center justify-center space-y-2 rounded-3xl bg-primary p-4 md:flex">
		<div class="flex flex-1 flex-col items-start justify-center space-y-2 px-4 sm:px-6">
			<p class="text-left text-xl tracking-tight text-white md:text-3xl">
				The easiest way to start your education journey!
			</p>
			<p class="text-left text-base font-light tracking-tight text-gray-200 sm:text-lg">
				Join us today and unlock your potential.
			</p>
		</div>
		<div class="w-full flex-1">
			<img
				src="https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?q=80&w=1170&auto=format&fit=crop"
				class="aspect-video h-auto w-full rounded-2xl object-cover shadow-lg/20"
				alt="" />
		</div>
	</div>
</div>
