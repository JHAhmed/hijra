<script>
    import { enhance } from '$app/forms';
    import { authStore } from '$lib/auth.svelte';
    import Icon from '@iconify/svelte';
    import Button from '$components/ui/Button.svelte';
    import Input from '$components/ui/Input.svelte';
    import favicon from '$lib/assets/favicon.svg';
    import makkahSkyline from '$lib/assets/images/makkah-skyline.jpg';
	import { page } from '$app/state';
	import { Toaster } from 'svelte-sonner';
	import { goto } from '$app/navigation';

    let { form } = $props();
    let errors = form?.errors || {};
    let authType = $state('login');
    let loading = $state(false);
    
    let data = $state({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    function toggleAuthType() {
        authType = authType === 'login' ? 'register' : 'login';
    }

    function handleEnhance() {
        loading = true;
        return async ({ update }) => {
            await update();
            loading = false;
			if (authStore.isAuthenticated) {
				goto('/');
			}
        };
    }
</script>

<svelte:head>
	<title>Login | Hijrah Portal</title>
	<meta
		name="description"
		content="Login to your account at Hijrah Portal to access personalized support for your medical education journey." />
	<link rel="canonical" href="https://hijrah-portal.vercel.app/auth" />
	<script type="application/ld+json">
		{
			"@context": "http://schema.org",
			"@type": "WebPage",
			"name": "Login | Hijrah Portal",
			"url": "https://hijrah-portal.vercel.app/auth"
		}
	</script>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Login | Hijrah Portal" />
	<meta property="og:image" content="{page.url.origin}/ogimage.png" />
	<meta property="og:url" content="{page.url.origin}/auth" />
	<meta
		property="og:description"
		content="Login to your account at Hijrah Portal to access personalized support for your medical education journey." />
</svelte:head>

<Toaster richColors position="top-center" />

<div
	class="flex min-h-screen w-full bg-white text-secondary ">
	{#if authStore.isLoading}
		<!-- Loading state - prevents flash -->
		<div class="flex w-full items-center justify-center">
			<div class="text-center">
				<div
					class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary">
				</div>
				<p class="text-sm text-gray-500">Loading...</p>
			</div>
		</div>
	{:else if authStore.isAuthenticated}
		<!-- Already logged in view -->
		<div class="relative flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-24">
            <div class="relative z-10 mx-auto w-full max-w-md">
                <a href="/" class="group/logo my-8 inline-flex items-center gap-3">
                    <img src={favicon} alt="Hijrah Portal Logo" class="h-8 w-8 object-contain transition-transform duration-300 md:h-10 md:w-10" />
                    <span class="text-3xl font-bold tracking-tighter text-black md:text-4xl">
                        Hijrah<span class="text-primary">.</span>
                    </span>
                </a>

                <div class="text-center">
                    <div class="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
                        <Icon icon="heroicons:check-circle-solid" class="h-10 w-10" />
                    </div>
                    <h2 class="text-3xl font-medium tracking-tight text-secondary">Welcome Back!</h2>
                    <p class="mt-4 text-gray-500">You are currently signed in.</p>

                    <div class="mt-8 flex flex-col gap-3">
                        <form method="POST" action="?/logout" use:enhance>
                            <Button type="submit" text="Sign out" class="w-full" />
                        </form>
                        <Button variant="secondary" href="/hijrah-portal" text="Go to Portal" />
                    </div>
                </div>
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
					<Icon icon="ph:quotes-fill" class="h-12 w-12" />
				</div>
				<blockquote class="text-3xl leading-tight font-medium tracking-tight text-white">
					"The guidance I received here made my Umrah not just a trip, but a spiritual
					transformation."
				</blockquote>
				<div class="mt-8 flex items-center gap-4">
					<div class="h-px w-12 bg-white/30"></div>
					<div class="flex flex-col">
						<span class="text-sm font-bold text-white">Ahmed Al-Farsi</span>
						<span class="text-xs text-white/60">Umrah Package 2024</span>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Login/Register form -->
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

				<div>
					<div class="mb-10">
						<span class="mb-3 block text-xs font-bold tracking-widest text-primary uppercase">
							{authType === 'login' ? 'Welcome Back' : 'Start your Journey'}
						</span>
						<h1 class="text-4xl font-medium tracking-tighter text-secondary md:text-5xl">
							{authType === 'login' ? 'Login to Portal' : 'Create Account'}
						</h1>
						<p class="mt-3 text-lg text-gray-500">
							{authType === 'login'
								? 'Enter your credentials to access your journey details.'
								: 'Join thousands of pilgrims planning their sacred journey.'}
						</p>
					</div>

					<form 
                        method="POST" 
                        action="?/{authType}" 
                        use:enhance={handleEnhance}
                        class="flex flex-col gap-5">
						{#if authType === 'register'}
							<div>
								<Input
									icon="heroicons:user"
									error={errors.name}
									label="Full Name"
									type="text"
									name="name"
									id="name"
									placeholder="e.g. Yusuf Ahmed"
									bind:value={data.name}
									class="bg-white" />
							</div>
						{/if}

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

						<Input
							icon="heroicons:lock-closed"
							error={errors.password}
							label="Password"
							type="password"
							name="password"
							id="password"
							allowView={true}
							placeholder="••••••••"
							bind:value={data.password}
							class="bg-white" />

						{#if authType === 'register'}
							<div>
								<Input
									icon="heroicons:lock-closed"
									label="Confirm Password"
									type="password"
									name="confirmPassword"
									id="confirmPassword"
									allowView={true}
									bind:value={data.confirmPassword}
									placeholder="••••••••"
									class="bg-white" />
							</div>
						{/if}

						<div class="mt-2">
							<Button
								type="submit"
								disabled={loading}
								variant="primary"
								text={authType === 'login' ? 'Sign In' : 'Create Account'}
								class="w-full px-4 py-4 text-sm font-bold text-white capitalize" />
						</div>

						<div class="flex items-center justify-between text-sm">
							<button
								type="button"
								onclick={toggleAuthType}
								class="cursor-pointer font-medium text-gray-500 transition-colors hover:text-primary">
								{authType === 'login' ? "Don't have an account?" : 'Already a member?'}
								<span class="ml-1 underline underline-offset-4"
									>{authType === 'login' ? 'Register' : 'Login'}</span>
							</button>

							{#if authType === 'login'}
								<a href="/auth/forgot-password" class="text-gray-400 hover:text-gray-600"
									>Forgot Password?</a>
							{/if}
						</div>
					</form>
				</div>
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
					<Icon icon="ph:quotes-fill" class="h-12 w-12" />
				</div>
				<blockquote class="text-3xl leading-tight font-medium tracking-tight text-white">
					"The guidance I received here made my Umrah not just a trip, but a spiritual
					transformation."
				</blockquote>
				<div class="mt-8 flex items-center gap-4">
					<div class="h-px w-12 bg-white/30"></div>
					<div class="flex flex-col">
						<span class="text-sm font-bold text-white">Ahmed Al-Farsi</span>
						<span class="text-xs text-white/60">Umrah Package 2024</span>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Add Svelte transition for slide if needed, or import from svelte/transition */
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
