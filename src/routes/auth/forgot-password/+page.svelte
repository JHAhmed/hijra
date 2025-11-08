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
            // Create password recovery - sends email with reset link
            await account.createRecovery(
                data.email,
                `${page.url.origin}/auth/reset-password`
            );

            toast.success('Password reset email sent! Check your inbox.');
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
    <title>Forgot Password | Hijra</title>
    <meta
        name="description"
        content="Reset your password for Hijra account."
    />
    <link rel="canonical" href="https://hijra-portal.vercel.app/auth/forgot-password" />
    <script type="application/ld+json">
        {
            "@context": "http://schema.org",
            "@type": "WebPage",
            "name": "Forgot Password | Hijra",
            "url": "https://hijra-portal.vercel.app/auth/forgot-password"
        }
    </script>

    <meta property="og:type" content="website" />
    <meta property="og:title" content="Forgot Password | Hijra" />
    <meta property="og:image" content="{page.url.origin}/ogimage.png" />
    <meta property="og:url" content="{page.url.origin}/auth/forgot-password" />
    <meta
        property="og:description"
        content="Reset your password for Hijra account."
    />
</svelte:head>

<Toaster richColors />

<div class="grid min-h-screen grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-2 md:p-8">
    <div class="mt-4 p-6 md:mt-8">
        <a href="/"><img src={favicon} alt="" class="mx-auto mb-8 h-10 sm:mb-12" /></a>

        {#if emailSent}
            <div class="flex flex-col items-center justify-center space-y-4">
                <div class="rounded-full bg-green-100 p-4">
                    <Icon icon="heroicons:check-circle" class="size-12 text-green-600" />
                </div>
                <h2 class="text-2xl font-light tracking-tight text-gray-700 sm:text-3xl">
                    Check Your Email
                </h2>
                <p class="text-center text-sm font-light text-gray-500">
                    We've sent a password reset link to <strong>{data.email}</strong>. 
                    Click the link in the email to reset your password.
                </p>
                <p class="text-xs text-gray-400">
                    Didn't receive the email? Check your spam folder or
                    <button
                        type="button"
                        onclick={() => (emailSent = false)}
                        class="cursor-pointer text-primary hover:underline">
                        try again
                    </button>
                </p>
                <a
                    href="/auth"
                    class="mt-4 text-sm text-primary hover:underline">
                    Back to login
                </a>
            </div>
        {:else}
            <form class="space-y-4 sm:space-y-6" onsubmit={handleSubmit}>
                <div
                    class="mx-auto mb-6 flex w-full flex-col items-start justify-center space-y-2 sm:mb-8 md:px-8 lg:px-20">
                    <h2 class="self-start text-2xl font-light tracking-tight text-gray-700 sm:text-3xl">
                        Forgot Password?
                    </h2>
                    <p class="self-start text-sm font-light text-gray-500">
                        No worries! Enter your email and we'll send you a reset link.
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
                    
                    <button
                        disabled={loading}
                        type="submit"
                        class="w-full cursor-pointer rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                        Send Reset Link
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
                Need help accessing your account?
            </p>
            <p class="text-left text-base font-light tracking-tight text-gray-200 sm:text-lg">
                We'll help you get back in quickly and securely.
            </p>
        </div>
        <div class="w-full flex-1">
            <img
                src="https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=1170&auto=format&fit=crop"
                class="aspect-video h-auto w-full rounded-2xl object-cover shadow-lg/20"
                alt="" />
        </div>
    </div>
</div>
