<script>
	let { name, title, handleEdit = () => {}, canEdit, isApproved, placeholder = false } = $props();
</script>

{#if !placeholder}
	<div class="mt-8 flex flex-col items-center justify-center space-y-6 px-8 pt-8">
		<h2 class="text-center text-4xl font-medium tracking-tight text-green-600">
			{title}
			{isApproved ? 'Approved!' : 'Submitted Successfully!'}
		</h2>
		<p class="text-center text-xl font-light text-gray-700">
			{#if isApproved}
				Thank you, {name}. Your application has been approved. You can now proceed to the next steps
				in your academic journey with us. This form can no longer be edited.
			{:else}
				Thank you, {name}, for submitting your {title.toLowerCase()}. We will review your submission
				and get back to you shortly.
			{/if}
		</p>

		{#if canEdit}
			<button
				onclick={handleEdit}
				class="cursor-pointer rounded-full bg-secondary px-6 py-3 text-sm font-medium text-white hover:bg-primary"
				>Edit {title.toLowerCase()}</button>
		{/if}

		<a
			href="/packages"
			class="rounded-full bg-secondary px-6 py-3 text-sm font-medium text-white hover:bg-primary"
			>Explore Universities</a>
	</div>
{:else}
	<div class="mt-8 flex flex-col items-center justify-center space-y-6 px-8 pt-8">
		<h2 class="text-center text-4xl font-medium tracking-tight text-green-600">
			Please wait for the previous step to be completed...
		</h2>
		<p class="text-center text-xl font-light text-gray-700">
			You can return to the home page and continue later.
		</p>
		<a
			href="/packages"
			class="rounded-full bg-secondary px-6 py-3 text-sm font-medium text-white hover:bg-primary"
			>Explore Universities</a>
	</div>
{/if}
