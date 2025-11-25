<script>
	import favicon from '$lib/assets/favicon.svg';
	import makkahSkyline from '$lib/assets/images/makkah-skyline.jpg';

	import { z } from 'zod';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
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
	let userId = $state('');
	let secret = $state('');
	let invalidLink = $state(false);

	let data = $state({
		password: '',
		confirmPassword: ''
	});

	const passwordSchema = z.object({
		password: z.string().min(6, 'Password must be at least 6 characters long'),
		confirmPassword: z.string().min(6, 'Password must be at least 6 characters long')
	});

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		userId = urlParams.get('userId') || '';
		secret = urlParams.get('secret') || '';

		if (!userId || !secret) {
			invalidLink = true;
			toast.error('Invalid or expired reset link.');
		}
	});

	async function handleSubmit(e) {
		e.preventDefault();
		loading = true;
		errors = {};

		const result = passwordSchema.safeParse(data);

		if (!result.success) {
			result.error.issues.forEach((issue) => {
				errors[issue.path[0]] = issue.message;
			});
			toast.error('Please fix the errors before proceeding.');
			loading = false;
			return;
		}

		if (data.password !== data.confirmPassword) {
			errors.confirmPassword = 'Passwords do not match';
			toast.error('Passwords do not match');
			loading = false;
			return;
		}

		try {
			await account.updateRecovery(userId, secret, data.password, data.confirmPassword);

			toast.success('Password reset successful! Redirecting...');

			setTimeout(() => {
				goto('/auth');
			}, 2000);
		} catch (error) {
			console.error('Password reset failed:', error);
			toast.error(error.message || 'Failed to reset password. Link may be expired.');
			invalidLink = true;
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Reset Password | Hijrah Portal</title>
	<meta name="description" content="Set a new password for your Hijrah Portal account." />
	<link rel="canonical" href="https://hijrah-portal.vercel.app/auth/reset-password" />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Reset Password | Hijrah Portal" />
	<meta property="og:image" content="{page.url.origin}/ogimage.png" />
	<meta property="og:url" content="{page.url.origin}/auth/reset-password" />
</svelte:head>

<Toaster richColors position="top-center" />

<div
	class="flex min-h-screen w-full bg-white text-secondary selection:bg-primary selection:text-white">
	<div class="relative flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-24">
		<div class="relative z-10 mx-auto w-full max-w-md">
			<a href="/" class="group/logo my-8 inline-flex items-center gap-3">
				<img
					src={favicon}
					alt="Hijrah Portal Logo"
					class="h-8 w-8 object-contain transition-transform duration-300 md:h-10 md:w-10" />
				<span class="text-3xl font-bold tracking-tighter text-black md:text-4xl">
					Hijrah<span class="text-primary">.</span>
				</span>
			</a>

			{#if invalidLink}
				<div in:fade={{ duration: 300 }} class="text-center">
					<div
						class="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
						<Icon icon="heroicons:x-circle-solid" class="h-10 w-10" />
					</div>
					<h2 class="text-3xl font-medium tracking-tight text-secondary">Link Expired</h2>
					<p class="mt-4 text-gray-500">
						This password reset link is invalid or has expired. Links are valid for 1 hour.
					</p>

					<div class="mt-8 flex flex-col gap-3">
						<a href="/auth/forgot-password" class="w-full">
							<Button
								variant="primary"
								text="Request New Link"
								class="w-full px-4 py-3 text-sm font-bold text-white capitalize" />
						</a>

						<a href="/auth" class="mt-2 text-sm font-medium text-gray-400 hover:text-secondary">
							Back to Login
						</a>
					</div>
				</div>
			{:else}
				<div in:fly={{ y: TRANSITION_y, duration: TRANSITION_DURATION }}>
					<div class="mb-10">
						<span class="mb-3 block text-xs font-bold tracking-widest text-primary uppercase">
							Security Update
						</span>
						<h1 class="text-4xl font-medium tracking-tighter text-secondary md:text-5xl">
							Set New Password
						</h1>
						<p class="mt-3 text-lg text-gray-500">
							Please create a strong password to secure your account.
						</p>
					</div>

					<form onsubmit={handleSubmit} class="flex flex-col gap-5">
						<Input
							icon="heroicons:lock-closed"
							error={errors.password}
							label="New Password"
							type="password"
							name="password"
							id="password"
							allowView={true}
							placeholder="Min. 6 characters"
							bind:value={data.password}
							class="bg-white" />

						<Input
							icon="heroicons:lock-closed"
							error={errors.confirmPassword}
							label="Confirm Password"
							type="password"
							name="confirmPassword"
							id="confirmPassword"
							allowView={true}
							placeholder="Re-enter password"
							bind:value={data.confirmPassword}
							class="bg-white" />

						<div class="mt-2">
							<Button
								type="submit"
								disabled={loading}
								variant="primary"
								text={loading ? 'Updating...' : 'Update Password'}
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
		<img src={makkahSkyline} alt="The Holy Kaaba" class="h-full w-full object-cover" />

		<div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

		<div class="absolute right-12 bottom-20 left-12 max-w-xl">
			<div class="mb-6 text-primary">
				<Icon icon="ph:lock-key-fill" class="h-12 w-12" />
			</div>
			<blockquote class="text-3xl leading-tight font-medium tracking-tight text-white">
				"Renew your intentions and continue your journey with peace of mind."
			</blockquote>
			<div class="mt-8 flex items-center gap-4">
				<div class="h-px w-12 bg-white/30"></div>
				<div class="flex flex-col">
					<span class="text-sm font-bold text-white">Secure Access</span>
					<span class="text-xs text-white/60">Hijrah Portal</span>
				</div>
			</div>
		</div>
	</div>
</div>
