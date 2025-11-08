<script>
    let { 
        title = "Travel Portal",
        description = "Explore the travel portal for resources and support - whether you're looking for trip planning, help with bookings, or travel advice.",
        imageSrc = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1170&auto=format&fit=crop"
     } = $props();
</script>

<div class="relative h-[40vh]">

	<img src={imageSrc} alt="background" class="absolute inset-0 object-cover w-full h-full opacity-75 lg:opacity-100 -z-20"/>
	<div class="absolute inset-0 bg-black opacity-70 -z-10"></div>    
	<div class="absolute inset-0 flex items-center justify-center mx-8 lg:mx-32">
		<div class="lg:w-1/2 text-center text-white lg:text-left">
			<h1 class="text-4xl lg:text-5xl font-semibold my-8 text-center relative">{title}</h1>

			<h6 class="text-center text-lg">
				{description}
			</h6>

		</div>
	</div>

</div>