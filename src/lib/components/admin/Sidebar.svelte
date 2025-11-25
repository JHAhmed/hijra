<script>
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { auth } from '$lib/auth.svelte';
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
    import favicon from '$lib/assets/favicon.svg';

    let { children } = $props();

    let isMobile = $state(false);
    let isExpanded = $state(false); 
    let isMobileOpen = $state(false);

    onMount(() => {
        const checkWidth = () => {
            isMobile = window.innerWidth < 1024;
            if (!isMobile) isMobileOpen = false;
        };
        
        checkWidth();
        window.addEventListener('resize', checkWidth);
        return () => window.removeEventListener('resize', checkWidth);
    });

    const mainMenu = [
        { name: 'Dashboard', href: '/admin', icon: 'heroicons:chart-bar-square' },
        { name: 'Students', href: '/admin/students', icon: 'heroicons:user-group' },
        { name: 'Users', href: '/admin/users', icon: 'heroicons:users' },
        { name: 'Interested', href: '/admin/interested', icon: 'heroicons:user-plus' },
        { name: 'Completed', href: '/admin/completed', icon: 'heroicons:check-badge' }
    ];

    const bottomMenu = [
        { name: 'Settings', href: '/admin/settings', icon: 'heroicons:cog-6-tooth' }
    ];

    function handleLogout() {
        auth.logout();
        goto('/auth');
    }
</script>

{#if isMobile && isMobileOpen}
    <div 
        role="button"
        tabindex="0"
        onclick={() => (isMobileOpen = false)}
        onkeydown={(e) => e.key === 'Escape' && (isMobileOpen = false)}
        class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
    ></div>
{/if}

{#if isMobile && !isMobileOpen}
    <button
        onclick={() => (isMobileOpen = true)}
        class="fixed top-5 left-5 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-secondary shadow-md transition-transform active:scale-95"
    >
        <Icon icon="heroicons:bars-3-solid" class="h-6 w-6" />
    </button>
{/if}

<aside
    class="fixed top-0 left-0 h-screen z-50 bg-white border-r border-gray-100 flex flex-col overflow-hidden transition-all duration-300 ease-out
    {isMobile 
        ? (isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full w-64') 
        : (isExpanded ? 'w-64' : 'w-20')}"
>
    <div class="h-20 flex items-center shrink-0 border-b border-gray-50 relative">
        <div class="w-20 h-full flex items-center justify-center shrink-0 bg-white z-20">
            <img src={favicon} alt="Logo" class="h-8 w-8 object-contain" />
        </div>

        <div class="absolute left-20 top-0 h-full flex items-center transition-opacity duration-300
            {isExpanded || (isMobile && isMobileOpen) ? 'opacity-100' : 'opacity-0'}"
        >
            <span class="text-xl font-bold tracking-tight text-secondary whitespace-nowrap">
                Hijrah<span class="text-primary">.</span>
            </span>
        </div>

        {#if isMobile}
            <button onclick={() => (isMobileOpen = false)} class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-secondary">
                <Icon icon="heroicons:x-mark" class="h-6 w-6" />
            </button>
        {/if}
    </div>

    <nav class="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {#each mainMenu as item}
            {@const isActive = page.url.pathname === item.href}
            
            <a
                href={item.href}
                title={!isExpanded && !isMobile ? item.name : ''}
                class="group relative flex items-center h-12 rounded-xl cursor-pointer select-none transition-colors duration-200
                {isActive ? 'bg-primary/5' : 'hover:bg-gray-50'}"
            >
                <div class="flex items-center min-w-64">
                    <div class="w-14 flex items-center justify-center shrink-0">
                        <Icon 
                            icon={item.icon} 
                            class="h-5 w-5 transition-colors duration-200 {isActive ? 'text-primary' : 'text-gray-600 group-hover:text-secondary'}" 
                        />
                    </div>

                    <span 
                        class="text-sm font-medium tracking-tight whitespace-nowrap transition-opacity duration-200
                        {isActive ? 'text-primary' : 'text-gray-500 group-hover:text-secondary'}
                        {isExpanded || (isMobile && isMobileOpen) ? 'opacity-100' : 'opacity-0'}"
                    >
                        {item.name}
                    </span>
                </div>
            </a>
        {/each}
    </nav>

    <div class="border-t border-gray-50 p-3 shrink-0 space-y-1 bg-white z-20">
        {#each bottomMenu as item}
            <a
                href={item.href}
                class="group relative flex items-center h-12 rounded-xl cursor-pointer overflow-hidden hover:bg-gray-50 transition-colors duration-200"
            >
                <div class="flex items-center min-w-64">
                    <div class="w-14 flex items-center justify-center shrink-0">
                        <Icon icon={item.icon} class="h-5 w-5 text-gray-600 group-hover:text-secondary transition-colors" />
                    </div>
                    <span class="text-sm font-medium tracking-tight text-gray-500 group-hover:text-secondary whitespace-nowrap transition-opacity duration-200
                        {isExpanded || (isMobile && isMobileOpen) ? 'opacity-100' : 'opacity-0'}">
                        {item.name}
                    </span>
                </div>
            </a>
        {/each}

        <button
            onclick={handleLogout}
            class="group relative w-full flex items-center h-12 rounded-xl cursor-pointer overflow-hidden hover:bg-red-50 transition-colors duration-200"
        >
            <div class="flex items-center min-w-64">
                <div class="w-14 flex items-center justify-center shrink-0">
                    <Icon icon="heroicons:arrow-left-start-on-rectangle-solid" class="h-5 w-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                </div>
                <span class="text-sm font-medium tracking-tight text-gray-500 group-hover:text-red-600 whitespace-nowrap transition-opacity duration-200
                    {isExpanded || (isMobile && isMobileOpen) ? 'opacity-100' : 'opacity-0'}">
                    Logout
                </span>
            </div>
        </button>

        {#if !isMobile}
            <div class="mt-2 border-t border-gray-50 pt-2">
                <button
                    onclick={() => (isExpanded = !isExpanded)}
                    class="group relative flex w-full items-center h-12 cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 ease-out 
                    hover:-translate-x-1 hover:-translate-y-1 hover:border-primary hover:shadow-[4px_4px_0px_0px_#00B77A]"
                >
                    <div class="flex items-center min-w-64">
                        <div class="w-14 flex items-center justify-center shrink-0">
                            <Icon 
                                icon={isExpanded ? "heroicons:chevron-double-left-20-solid" : "heroicons:chevron-double-right-20-solid"} 
                                class="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" 
                            />
                        </div>
                        <span class="text-sm font-medium tracking-tight text-gray-400 group-hover:text-primary whitespace-nowrap transition-opacity duration-200
                            {isExpanded ? 'opacity-100' : 'opacity-0'}">
                            Collapse Sidebar
                        </span>
                    </div>
                </button>
            </div>
        {/if}
    </div>
</aside>

<div 
    class="min-h-screen bg-white transition-all duration-300 ease-out
    {isMobile ? 'ml-0 pt-20' : (isExpanded ? 'ml-64' : 'ml-20')}"
>
    {@render children?.()}
</div>