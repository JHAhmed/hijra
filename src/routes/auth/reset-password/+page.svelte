<script>
    import favicon from '$lib/assets/favicon.svg';
    
    import { z } from 'zod';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { blur } from 'svelte/transition';
    import { account } from '$lib/appwrite.js';
    import { toast, Toaster } from 'svelte-sonner';

    import Icon from '@iconify/svelte';
    import Input from '$components/ui/Input.svelte';
    
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
        // Extract userId and secret from URL query parameters
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
            // Complete password recovery with userId, secret, and new password
            await account.updateRecovery(
                userId,
                secret,
                data.password,
                data.confirmPassword
            );

            toast.success('Password reset successful! Redirecting to login...');
            
            // Redirect to login page after 2 seconds
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
    <title>Reset Password | hijrah</title>
    <meta
        name="description"
        content="Set a new password for your hijrah account."
    />
    <link rel="canonical" href="https://hijrah-portal.vercel.app/auth/reset-password" />
    <script type="application/ld+json">
        {
            "@context": "http://schema.org",
            "@type": "WebPage",
            "name": "Reset Password | hijrah",
            "url": "https://hijrah-portal.vercel.app/auth/reset-password"
        }
    </script>

    <meta property="og:type" content="website" />
    <meta property="og:title" content="Reset Password | hijrah" />
    <meta property="og:image" content="{page.url.origin}/ogimage.png" />
    <meta property="og:url" content="{page.url.origin}/auth/reset-password" />
    <meta
        property="og:description"
        content="Set a new password for your hijrah account."
    />
</svelte:head>

<Toaster richColors />

<div class="grid min-h-screen grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-2 md:p-8">
    <div class="mt-4 p-6 md:mt-8">
        <a href="/"><img src={favicon} alt="" class="mx-auto mb-8 h-10 sm:mb-12" /></a>

        {#if invalidLink}
            <div class="flex flex-col items-center justify-center space-y-4">
                <div class="rounded-full bg-red-100 p-4">
                    <Icon icon="heroicons:x-circle" class="size-12 text-red-600" />
                </div>
                <h2 class="text-2xl font-light tracking-tight text-gray-700 sm:text-3xl">
                    Invalid or Expired Link
                </h2>
                <p class="text-center text-sm font-light text-gray-500">
                    This password reset link is invalid or has expired. 
                    Reset links are only valid for 1 hour.
                </p>
                <a
                    href="/auth/forgot-password"
                    class="mt-4 rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90">
                    Request New Link
                </a>
                <a
                    href="/auth"
                    class="text-sm text-primary hover:underline">
                    Back to login
                </a>
            </div>
        {:else}
            <form class="space-y-4 sm:space-y-6" onsubmit={handleSubmit}>
                <div
                    class="mx-auto mb-6 flex w-full flex-col items-start justify-center space-y-2 sm:mb-8 md:px-8 lg:px-20">
                    <h2 class="self-start text-2xl font-light tracking-tight text-gray-700 sm:text-3xl">
                        Set New Password
                    </h2>
                    <p class="self-start text-sm font-light text-gray-500">
                        Please enter your new password below.
                    </p>
                </div>

                <div
                    class="mx-auto flex w-full flex-col items-center justify-center space-y-4 sm:space-y-6 md:px-8 lg:px-20">
                    <Input
                        icon="heroicons:lock-closed"
                        error={errors.password}
                        label="New Password"
                        type="password"
                        name="password"
                        id="password"
                        allowView={true}
                        placeholder="Enter new password"
                        bind:value={data.password} />
                    
                    <Input
                        icon="heroicons:lock-closed"
                        error={errors.confirmPassword}
                        label="Confirm New Password"
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        allowView={true}
                        placeholder="Re-enter new password"
                        bind:value={data.confirmPassword} />
                    
                    <button
                        disabled={loading}
                        type="submit"
                        class="w-full cursor-pointer rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                        Reset Password
                        {#if loading}
                            <Icon
                                icon="ph:circle-notch"
                                class="mb-px ml-2 inline-flex size-5 animate-spin text-white transition-all duration-150 group-hover:ml-4" />
                        {/if}
                    </button>
                    
                    <p class="self-start text-left text-xs">
                        Remember your password? <a
                            href="/auth"
                            class="cursor-pointer text-primary hover:underline">Back to login</a>
                    </p>
                </div>
            </form>
        {/if}
    </div>

    <div
        class="hidden flex-col items-center justify-center space-y-2 rounded-3xl bg-primary p-4 md:flex">
        <div class="flex flex-1 flex-col items-start justify-center space-y-2 px-4 sm:px-6">
            <p class="text-left text-xl tracking-tight text-white md:text-3xl">
                Secure your account with a strong password!
            </p>
            <p class="text-left text-base font-light tracking-tight text-gray-200 sm:text-lg">
                Make sure to use a combination of letters, numbers, and symbols.
            </p>
        </div>
        <div class="w-full flex-1">
            <img
                src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1170&auto=format&fit=crop"
                class="aspect-video h-auto w-full rounded-2xl object-cover shadow-lg/20"
                alt="" />
        </div>
    </div>
</div>
