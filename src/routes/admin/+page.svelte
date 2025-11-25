
<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition'; 
    import { Toaster } from 'svelte-sonner';
    import Icon from '@iconify/svelte';
    import Modal from '$components/ui/Modal.svelte';

    let isLoading = $state(true);
    
    let stats = $state({
        total: { value: 1240, label: 'Active', sub: 'Registered students' },
        interested: { value: 263, label: 'Interested', sub: 'Potential leads' },
        shortlisted: { value: 85, label: 'Shortlisted', sub: 'Review Required' },
        approved: { value: 42, label: 'Approved', sub: 'Visa Processed' }
    });

    let recentActivity = $state([
        { name: 'Yusuf Ahmed', action: 'Submitted Application', time: '2m', type: 'hajj' },
        { name: 'Fatima Zahra', action: 'Uploaded Passport', time: '15m', type: 'umrah' },
        { name: 'Omar Farooq', action: 'Payment Completed', time: '1h', type: 'hajj' },
        { name: 'Aisha Siddiqua', action: 'Query Received', time: '3h', type: 'general' },
        { name: 'Zaid Ibn Haritha', action: 'Visa Approved', time: '5h', type: 'hajj' },
    ]);

    let packageCapacity = $state([
        { name: 'Premium Hajj 2026', current: 45, max: 100, color: 'bg-emerald-500' },
        { name: 'Ramadan Umrah', current: 82, max: 90, color: 'bg-blue-500' },
        { name: 'Luxury Shifting', current: 12, max: 50, color: 'bg-purple-500' }
    ]);

    onMount(() => {
        setTimeout(() => { isLoading = false; }, 800);
    });

    const todayDate = new Date().toLocaleDateString('en-GB', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
    });

    function getInitials(name) {
        return name.split(' ').map(n => n[0]).slice(0, 2).join('');
    }
</script>

<Toaster position="bottom-right" />

{#if isLoading}
    <Modal text="Syncing Dashboard..." />
{/if}

<div class="mx-auto w-full max-w-[1600px] space-y-8 p-6 md:p-10" in:fade={{ duration: 500 }}>
    
    <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div class="space-y-1">
            <span class="text-xs font-bold tracking-widest text-gray-400 uppercase">
                {todayDate}
            </span>
            <h1 class="text-3xl font-medium tracking-tighter text-secondary md:text-4xl">
                Overview
            </h1>
        </div>

        <div class="flex items-center gap-3">
            <button class="group flex h-10 cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-xs font-bold text-secondary transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-95">
                <Icon icon="heroicons:arrow-down-tray" class="h-3.5 w-3.5 text-gray-400 transition-colors group-hover:text-secondary" />
                <span>Export</span>
            </button>
            <button class="group flex h-10 cursor-pointer items-center gap-2 rounded-full bg-secondary px-5 text-xs font-bold text-white shadow-lg shadow-secondary/10 transition-all hover:bg-black active:scale-95">
                <Icon icon="heroicons:plus" class="h-3.5 w-3.5" />
                <span>New Pilgrim</span>
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-6">
            
            <div class="group relative flex cursor-pointer flex-col justify-between rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md">
                <div class="flex items-start justify-between">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-secondary">
                        <Icon icon="heroicons:users" class="h-5 w-5" />
                    </div>
                    <span class="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                        <Icon icon="heroicons:arrow-trending-up" class="h-3 w-3" /> 12%
                    </span>
                </div>
                <div class="mt-6">
                    <h3 class="text-4xl font-medium tracking-tighter text-secondary">{stats.total.value.toLocaleString()}</h3>
                    <p class="mt-1 text-sm font-medium text-secondary">{stats.total.label}</p>
                    <p class="text-xs text-gray-400">{stats.total.sub}</p>
                </div>
            </div>

            <div class="group relative flex cursor-pointer flex-col justify-between rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md">
                <div class="flex items-start justify-between">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Icon icon="heroicons:user-plus" class="h-5 w-5" />
                    </div>
                </div>
                <div class="mt-6">
                    <h3 class="text-4xl font-medium tracking-tighter text-secondary">{stats.interested.value}</h3>
                    <p class="mt-1 text-sm font-medium text-secondary">{stats.interested.label}</p>
                    <p class="text-xs text-gray-400">{stats.interested.sub}</p>
                </div>
            </div>

            <div class="group relative flex cursor-pointer flex-col justify-between rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-md">
                <div class="flex items-start justify-between">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                        <Icon icon="heroicons:star" class="h-5 w-5" />
                    </div>
                </div>
                <div class="mt-6">
                    <h3 class="text-4xl font-medium tracking-tighter text-secondary">{stats.shortlisted.value}</h3>
                    <p class="mt-1 text-sm font-medium text-secondary">{stats.shortlisted.label}</p>
                    <p class="text-xs text-gray-400">{stats.shortlisted.sub}</p>
                </div>
            </div>

            <div class="group relative flex cursor-pointer flex-col justify-between rounded-[2rem] border border-gray-900 bg-secondary p-8 text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20">
                <div class="flex items-start justify-between">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-emerald-400 backdrop-blur-sm">
                        <Icon icon="heroicons:check-badge" class="h-5 w-5" />
                    </div>
                </div>
                <div class="mt-6">
                    <h3 class="text-4xl font-medium tracking-tighter text-white">{stats.approved.value}</h3>
                    <p class="mt-1 text-sm font-medium text-white">{stats.approved.label}</p>
                    <p class="text-xs text-gray-400">{stats.approved.sub}</p>
                </div>
            </div>

            <div class="flex flex-col justify-center rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm sm:col-span-2">
                <div class="mb-8 flex items-end justify-between">
                    <div>
                        <h3 class="text-xl font-medium tracking-tight text-secondary">Package Capacity</h3>
                        <p class="mt-1 text-sm text-gray-500">Real-time slot availability.</p>
                    </div>
                    <div class="hidden h-px w-24 bg-gray-100 sm:block"></div>
                </div>

                <div class="space-y-8">
                    {#each packageCapacity as pkg}
                        <div class="group cursor-default">
                            <div class="mb-3 flex items-center justify-between text-sm">
                                <div class="flex items-center gap-3">
                                    <span class="font-medium text-secondary">{pkg.name}</span>
                                    <span class="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
                                        {pkg.max} Slots Total
                                    </span>
                                </div>
                                <span class="font-medium text-gray-900">{pkg.current} / {pkg.max}</span>
                            </div>
                            
                            <div class="relative h-2 w-full overflow-hidden rounded-full bg-gray-50">
                                <div 
                                    class="absolute left-0 top-0 h-full rounded-full {pkg.color} transition-all duration-1000 ease-out group-hover:brightness-110" 
                                    style="width: {(pkg.current / pkg.max) * 100}%"
                                ></div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <div class="flex h-fit flex-col rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm lg:col-span-1">
            <div class="mb-8 flex items-center justify-between">
                <h3 class="text-lg font-medium tracking-tight text-secondary">Live Activity</h3>
                <a href="/admin/users" class="text-[11px] font-bold tracking-widest text-primary uppercase hover:underline">View All</a>
            </div>

            <div class="flex-1 space-y-6 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {#each recentActivity as activity}
                    <div class="group flex cursor-pointer gap-4 transition-opacity hover:opacity-100">
                        <div class="relative mt-1">
                            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-[10px] font-bold text-secondary ring-1 ring-gray-100 transition-all duration-300 group-hover:bg-secondary group-hover:text-white group-hover:shadow-md">
                                {getInitials(activity.name)}
                            </div>
                            {#if activity.type === 'hajj'}
                                <div class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 transition-transform group-hover:scale-0"></div>
                            {:else if activity.type === 'umrah'}
                                <div class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 transition-transform group-hover:scale-0"></div>
                            {/if}
                        </div>
                        <div class="flex flex-1 flex-col justify-center">
                            <div class="flex justify-between">
                                <span class="text-sm font-medium text-secondary">{activity.name}</span>
                                <span class="text-[10px] font-medium text-gray-300 uppercase tracking-wide">{activity.time}</span>
                            </div>
                            <span class="text-xs text-gray-400">{activity.action}</span>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

    </div>
</div>