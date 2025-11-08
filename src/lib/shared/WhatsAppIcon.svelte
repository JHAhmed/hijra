<script>
	import Icon from '@iconify/svelte';
</script>

<a
	href="https://api.whatsapp.com/send?phone=919345211256&text=Hi%20I%20have%20an%20inquiry%20about%20your%20services!"
	aria-label="Chat on WhatsApp"
	target="_blank"
	class="fixed right-6 bottom-6 z-50 cursor-pointer md:right-8 md:bottom-8 lg:right-12 lg:bottom-12">
	<div class="flex items-center justify-center rounded-full bg-green-500 p-4">
		<!-- <WhatsappIcon className="size-8 text-white" /> -->
		<Icon icon="simple-icons:whatsapp" class="h-8 w-8 text-white" />
	</div>
</a>
