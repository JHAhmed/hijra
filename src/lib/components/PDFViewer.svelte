<script>
	import Icon from '@iconify/svelte';

	let { pdfUrl, downloadFilename = undefined } = $props();
</script>

<div class="w-full overflow-hidden rounded-lg border border-gray-300 shadow-lg">
	<div class="border-b border-gray-300 bg-gray-100 p-3 text-center">
		<a
			href={pdfUrl}
			download={downloadFilename}
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 tracking-tight text-white transition-colors duration-300 hover:bg-primary/90">
			<Icon icon="ph:download-simple" class="h-5 w-5" />

			Download PDF
		</a>
	</div>

	<iframe src={pdfUrl} title="PDF Viewer" class="block h-[800px] w-full" frameborder="0">
		This browser does not support PDFs. Please download the PDF to view it.
	</iframe>
</div>
