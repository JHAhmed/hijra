<script>
	// import { auth, login, logout, register, user } from '$lib/unused/user.svelte.js';
	import favicon from '$lib/assets/favicon.svg';
	import Input from '$components/ui/Input.svelte';
	import { blur } from 'svelte/transition';
	import { z } from 'zod';
	import { toast, Toaster } from 'svelte-sonner';
	import Icon from '@iconify/svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { auth } from '$lib/auth.svelte';

	let authType = $state('login'); // 'login' or 'register'
	let errors = $state({});
	let loading = $state(false);

	let data = $state({
		// name: '',
		email: '',
		password: ''
	});

	const detailsSchema = z.object({
		name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
		email: z.string().email('Please enter a valid email'),
		password: z.string().min(6, 'Password must be at least 6 characters long')
	});

	// const login = async (e) => {
	// 	e.preventDefault();
	// 	const formData = new FormData(e.target);
	// 	await user.login(formData.get('email'), formData.get('password'));
	// };

	// const register = async (e) => {
	// 	e.preventDefault();

	// 	if (data.password !== e.target.confirmPassword.value) {
	// 		errors.password = 'Passwords do not match';
	// 		toast.error('Passwords do not match');
	// 		return;
	// 	}

	// 	const formData = new FormData(e.target);
	// 	await user.register(formData.get('email'), formData.get('password'), formData.get('name'));
	// };

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

		if (authType === 'register') {
			const confirmPassword = e.target.confirmPassword.value;
			if (data.password !== confirmPassword) {
				errors.password = 'Passwords do not match';
				toast.error('Passwords do not match');
				loading = false;
				return;
			}
		}

		try {
			if (authType === 'login') {
				await auth.login(data.email, data.password);
			} else {
				await auth.register(data.email, data.password, data.name);
				// const res = await fetch('/api/register-user', {
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-Type': 'application/json'
				// 	},
				// 	body: JSON.stringify({ email: auth.user.email, name: auth.user.name, userId: auth.user.$id })
				// });
				// if (!res.ok) {
				// 	throw new Error('Failed to register user in the database.');
				// } else {
				// 	const resData = await res.json();
				// }
			}

			toast.success(`Successfully ${authType === 'login' ? 'logged in' : 'registered'}!`);
			await invalidateAll();
			await goto('/');
		} catch (error) {
			console.error('Authentication failed:', error);
			toast.error(error.message || 'An unknown error occurred.');
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login | hijrah</title>
	<meta
		name="description"
		content="Login to your account at hijrah to access personalized support for your medical education journey."
	/>
	<link rel="canonical" href="https://hijrah-portal.vercel.app/auth" />
	<script type="application/ld+json">
		{
			"@context": "http://schema.org",
			"@type": "WebPage",
			"name": "Login | hijrah",
			"url": "https://hijrah-portal.vercel.app/auth"
		}
	</script>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Login | hijrah" />
	<meta property="og:image" content="{page.url.origin}/ogimage.png" />
	<meta property="og:url" content="{page.url.origin}/auth" />
	<meta
		property="og:description"
		content="Login to your account at hijrah to access personalized support for your medical education journey."
	/>
</svelte:head>

<Toaster richColors />

<div class="grid min-h-screen grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-2 md:p-8" >

	<div class="mt-4 p-6 md:mt-8 ">
		<a href="/"><img src={favicon} alt="" class="mx-auto mb-8 h-10 sm:mb-12" /></a>
		{#if auth.isLoggedIn}
			<div class="flex flex-col items-center justify-center space-y-4">
				<h2 class="text-2xl font-light tracking-tight text-gray-700 sm:text-3xl">
					{#if authType === 'login'}
						You are logged in!
					{:else}
						You have successfully registered!
					{/if}
				</h2>
				<p class="text-sm font-light text-gray-500">
					Go to your
						{#if auth.isAdmin}
						<a href="/admin" class="text-primary hover:underline">Admin Dashboard</a>
						{:else}
							<a href="/hijrah-portal" class="text-primary hover:underline">hijrah Portal</a>
						{/if}
					or
					<button onclick={() => auth.logout()} class="cursor-pointer text-primary hover:underline"
						>Logout</button>
				</p>
			</div>
		{:else if authType === 'login'}
			<form class="space-y-4 sm:space-y-6" onsubmit={handleSubmit}>
				<div
					class="mx-auto mb-6 flex w-full flex-col items-start justify-center space-y-2 sm:mb-8 md:px-8 lg:px-20">
					<h2 class="self-start text-2xl font-light tracking-tight text-gray-700 sm:text-3xl">
						Login To Your Account
					</h2>
					<p class="self-start text-sm font-light text-gray-500">
						Please enter your credentials to continue.
					</p>
				</div>

				<div
					class="mx-auto flex w-full flex-col items-center justify-center space-y-4 sm:space-y-6 md:px-8 lg:px-20">
					<Input
						icon="heroicons:envelope"
						error={errors.email}
						label="Email"
						type="email"
						name="email"
						id="email"
						placeholder="Enter your email"
						bind:value={data.email} />
					<Input
						icon="heroicons:lock-closed"
						error={errors.password}
						label="Password"
						type="password"
						name="password"
						id="password"
						allowView={true}
						placeholder="Enter your password"
						bind:value={data.password} />
					<button
						disabled={loading}
						type="submit"
						class="w-full cursor-pointer rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
						Login
						{#if loading}
							<Icon
								icon="ph:circle-notch"
								class="mb-px ml-2 inline-flex size-5 animate-spin text-white transition-all duration-150 group-hover:ml-4" />
						{/if}
					</button>
					<p class="self-start text-left text-xs mb-2">
						Don't have an account? <button
							type="button"
							onclick={() => (authType = 'register')}
							class="cursor-pointer text-primary hover:underline">Register</button>
					</p>
					<p class="self-start text-left text-xs">
						Forgot Password? <a
							href="/auth/forgot-password"
							class="cursor-pointer text-primary hover:underline">Reset</a>
					</p>
				</div>
			</form>
		{:else}
			<form class="space-y-4 sm:space-y-6" onsubmit={handleSubmit}>
				<div
					class="mx-auto mb-6 flex w-full flex-col items-start justify-center space-y-2 sm:mb-8 md:px-8 lg:px-20">
					<h2 class="self-start text-2xl font-light tracking-tight text-gray-700 sm:text-3xl">
						Get Started Now!
					</h2>
					<p class="self-start text-sm font-light text-gray-500">
						Please enter your credentials to create an account.
					</p>
				</div>

				<div
					class="mx-auto flex w-full flex-col items-center justify-center space-y-4 sm:space-y-6 md:px-8 lg:px-20">
					<Input
						icon="heroicons:user"
						error={errors.name}
						label="Name"
						type="text"
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
					<Input
						icon="heroicons:lock-closed"
						error={errors.password}
						label="Password"
						type="password"
						name="password"
						id="password"
						allowView={true}
						placeholder="Enter your password"
						bind:value={data.password} />
					<Input
						icon="heroicons:lock-closed"
						label="Confirm Password"
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						allowView={true}
						placeholder="Re-enter your password" />
					<button
						type="submit"
						class="{loading
							? 'cursor-not-allowed opacity-70'
							: ''} w-full cursor-pointer rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
						>Register</button>
					<p class="self-start text-left text-xs">
						Already have an account? <button
							type="button"
							onclick={() => (authType = 'login')}
							class="cursor-pointer text-primary hover:underline">Login</button>
					</p>
				</div>
			</form>
		{/if}
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
