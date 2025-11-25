<script>
	import favicon from '$lib/assets/favicon.svg';
	import islamicBuilding from '$lib/assets/images/islamic-building.jpg';

	import { z } from 'zod';
	import { page } from '$app/state';
	import { fade, fly } from 'svelte/transition';
	import { account } from '$lib/appwrite.js';
	import { toast, Toaster } from 'svelte-sonner';

	import Icon from '@iconify/svelte';
	import Input from '$components/ui/Input.svelte';
	import Button from '$components/ui/Button.svelte';

	// Animation constants
	const TRANSITION_y = 20;
	const TRANSITION_DURATION = 400;

	let errors = $state({});
	let loading = $state(false);
	let emailSent = $state(false);

	let data = $state({
		email: ''
	});

	const emailSchema = z.object({
		email: z.string().email('Please enter a valid email')
	});

	async function handleSubmit(e) {
		e.preventDefault();
		loading = true;
		errors = {};

		const result = emailSchema.safeParse(data);

		if (!result.success) {
			result.error.issues.forEach((issue) => {
				errors[issue.path[0]] = issue.message;
			});
			toast.error('Please fix the errors before proceeding.');
			loading = false;
			return;
		}

		try {
			await account.createRecovery(data.email, `${page.url.origin}/auth/reset-password`);

			toast.success('Password reset email sent!');
			emailSent = true;
		} catch (error) {
			console.error('Password recovery failed:', error);
			toast.error(error.message || 'Failed to send recovery email.');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Forgot Password | hijrah</title>
	<meta name="description" content="Reset your password for hijrah account." />
	<link rel="canonical" href="https://hijrah-portal.vercel.app/auth/forgot-password" />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Forgot Password | hijrah" />
	<meta property="og:image" content="{page.url.origin}/ogimage.png" />
	<meta property="og:url" content="{page.url.origin}/auth/forgot-password" />
</svelte:head>

<Toaster richColors position="top-center" />

<div
	class="flex min-h-screen w-full bg-white text-secondary selection:bg-primary selection:text-white">
	<div class="relative flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-24">
		<div class="relative z-10 mx-auto w-full max-w-md">
			<a href="/" class="group/logo my-8 inline-flex items-center gap-3">
				<img
					src={favicon}
					alt="hijrah Logo"
					class="h-8 w-8 object-contain transition-transform duration-300 md:h-10 md:w-10" />
				<span class="text-3xl font-bold tracking-tighter text-black md:text-4xl">
					hijrah<span class="text-primary">.</span>
				</span>
			</a>

			{#if emailSent}
				<div in:fade={{ duration: 300 }} class="text-center">
					<div
						class="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
						<Icon icon="heroicons:check-circle-solid" class="h-10 w-10" />
					</div>
					<h2 class="text-3xl font-medium tracking-tight text-secondary">Check your Inbox</h2>
					<p class="mt-4 text-gray-500">
						We've sent a password reset link to <br /><span class="font-semibold text-secondary"
							>{data.email}</span>
					</p>

					<div class="mt-8 flex flex-col gap-3">
						<a href="/auth" class="w-full">
							<Button
								variant="primary"
								text="Back to Login"
								class="w-full px-4 py-3 text-sm font-bold text-white uppercase" />
						</a>

						<button
							onclick={() => (emailSent = false)}
							class="mt-2 text-sm font-medium text-gray-400 hover:text-secondary">
							Try a different email
						</button>
					</div>
				</div>
			{:else}
				<div in:fly={{ y: TRANSITION_y, duration: TRANSITION_DURATION }}>
					<div class="mb-10">
						<span class="mb-3 block text-xs font-bold tracking-widest text-primary uppercase">
							Account Recovery
						</span>
						<h1 class="text-4xl font-medium tracking-tighter text-secondary md:text-5xl">
							Forgot Password?
						</h1>
						<p class="mt-3 text-lg text-gray-500">
							No worries! Enter your email and we'll send you a secure reset link.
						</p>
					</div>

					<form onsubmit={handleSubmit} class="flex flex-col gap-5">
						<Input
							icon="heroicons:envelope"
							error={errors.email}
							label="Email Address"
							type="email"
							name="email"
							id="email"
							placeholder="name@example.com"
							bind:value={data.email}
							class="bg-white" />

						<div class="mt-2">
							<Button
								type="submit"
								disabled={loading}
								variant="primary"
								text={loading ? 'Sending...' : 'Send Reset Link'}
								class="w-full px-4 py-4 text-sm font-bold text-white capitalize" />
						</div>

						<div class="flex items-center justify-center text-sm">
							<a
								href="/auth"
								class="flex items-center gap-2 font-medium text-gray-500 transition-colors hover:text-primary">
								<Icon icon="heroicons:arrow-left" class="h-4 w-4" />
								Back to login
							</a>
						</div>
					</form>
				</div>
			{/if}
		</div>

		<div class="absolute bottom-6 left-0 w-full text-center">
			<p class="text-xs text-gray-300">© 2025 Hijrah. All rights reserved.</p>
		</div>
	</div>

	<div class="relative hidden w-1/2 bg-gray-100 lg:block">
		<img src={islamicBuilding} alt="An Islamic Building" class="h-full w-full object-cover" />

		<div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

		<div class="absolute right-12 bottom-20 left-12 max-w-xl">
			<div class="mb-6 text-primary">
				<Icon icon="ph:shield-check-fill" class="h-12 w-12" />
			</div>
			<blockquote class="text-3xl leading-tight font-medium tracking-tight text-white">
				"Trust in the journey. Every step, even the pauses, brings you closer to your destination."
			</blockquote>
			<div class="mt-8 flex items-center gap-4">
				<div class="h-px w-12 bg-white/30"></div>
				<div class="flex flex-col">
					<span class="text-sm font-bold text-white">Hijrah Support</span>
					<span class="text-xs text-white/60">Always here to help</span>
				</div>
			</div>
		</div>
	</div>
</div>
