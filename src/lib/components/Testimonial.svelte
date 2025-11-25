<script>
	import Icon from '@iconify/svelte';

	let {
		quote = 'Hijrah made my Umrah completely stress-free. The team handled everything perfectly, allowing me to focus entirely on my spiritual journey.',
		name = 'Mohammed Abdullah',
		college = 'Performed Umrah 2024',
		avatarSrc = '',
		icon = 'heroicons:user-circle'
	} = $props();
</script>

<figure class="relative h-full rounded-2xl bg-gray-50 p-6 transition-all hover:bg-gray-100 sm:p-8">
	<div class="mb-4 flex items-center gap-3">
		<div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
			<Icon icon={icon} class="h-8 w-8 text-emerald-600" />
		</div>
		<div>
			<p class="font-medium text-gray-900">{name}</p>
			<p class="text-xs text-gray-600">{college}</p>
		</div>
	</div>
	<blockquote class="relative">
		<Icon icon="heroicons:quote-left" class="absolute -top-2 -left-1 h-6 w-6 text-gray-300" />
		<p class="pl-6 text-sm leading-relaxed text-gray-700">{quote}</p>
	</blockquote>
</figure>
