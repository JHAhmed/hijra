<script>
    import Icon from "@iconify/svelte";
	import { toast, Toaster } from "svelte-sonner";

    let { value } = $props();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
        toast.success("Copied to clipboard!")
    };
</script>

<Toaster />

<button class="items-center p-1 inline-flex rounded-md border border-gray-200 hover:border-gray-300 transition-colors duration-200 ease-in-out" onclick={copyToClipboard}>
    <Icon icon="mdi:content-copy" class="size-4" />
</button>