<script>
    import { gsap } from 'gsap';
    import { onMount } from 'svelte';
	import { page } from '$app/state';
    import { SplitText } from 'gsap/SplitText';
	import { toast, Toaster } from 'svelte-sonner';

    import Icon from '@iconify/svelte';
	import Input from '$components/ui/Input.svelte';
	import { socials } from '$lib';

    gsap.registerPlugin(SplitText);

    let title = $state(null);
    let formDetails = $state({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    onMount(() => {
        if (!title) return;
        const split = new SplitText(title, { type: 'words' });

        gsap.from(split.words, {
            y: 10,
            opacity: 0,
            duration: 1.0,
            delay: 0.5,
            ease: 'power2.out',
            stagger: 0.15
        });
    });

	async function onsubmit(event) {
        event.preventDefault();

		if (formDetails.name && formDetails.email && formDetails.subject && formDetails.message) {
			try {
				const response = await fetch('/api/send-email', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name: formDetails.name, email: formDetails.email, subject: formDetails.subject, message: formDetails.message, cta: false })
				});

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				toast.success(`Thank you, ${formDetails.name}. <br> We will contact you soon!`);
			} catch (error) {
				console.error('Error sending email:', error);
			} finally {
				formDetails = {
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                };
			}
		} else {
			toast('Please fill all the fields');
		}
	}

</script>

<svelte:head>
	<title>Contact | Hijra</title>
	<meta
		name="description"
		content="Get in touch with Hijra for any inquiries or assistance regarding studying abroad."
	/>
	<link rel="canonical" href="https://hijra-portal.vercel.app/contact" />
	<script type="application/ld+json">
		{
			"@context": "http://schema.org",
			"@type": "WebPage",
			"name": "Contact | Hijra",
			"url": "https://hijra-portal.vercel.app/contact"
		}
	</script>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Contact | Hijra" />
	<meta property="og:image" content="{page.url.origin}/ogimage.png" />
	<meta property="og:url" content="{page.url.origin}/" />
	<meta
		property="og:description"
		content="Get in touch with Hijra for any inquiries or assistance regarding studying abroad."
	/>
</svelte:head>

<Toaster closeButton position="bottom-right" />

<section class="bg-white px-8 py-16 text-center">
    <div class="mx-auto max-w-5xl">
        <p class="mb-4 text-sm tracking-widest text-gray-600 uppercase">Let's Connect</p>
        <h1 bind:this={title} class="text-5xl font-medium tracking-tighter text-black lg:text-7xl">
            Get In Touch.
        </h1>
        <p class="mx-auto mt-8 max-w-3xl text-lg font-normal tracking-[-0.015em] text-gray-700">
            Whether you have a question about our services, need assistance, or just want to talk, we'd
            love to hear from you.
        </p>
    </div>
</section>

<div class="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
	{#each socials as link, i}
		<a
			href={link.url}
			class="flex w-full group items-center border-t border-gray-200 p-4 transition-colors duration-200 hover:bg-gray-100
			{i % 2 !== 1 ? 'border-r' : ''} 
			{i < 2 ? 'md:border-r' : ''} 
			{i === 3 ? 'md:border-r-0' : ''}"
			target="_blank"
			rel="noopener noreferrer"
			aria-label={link.name}
		>
			<Icon icon={link.icon} class="h-5 w-5 flex-shrink-0 text-gray-700 {`group-hover:text-${link.hoverColor}`}" />
			<span class="ml-3 grow text-sm tracking-tight text-gray-800">{link.name}</span>
			<Icon icon="heroicons:arrow-up-right" class="h-4 w-4 text-gray-500" />
		</a>
	{/each}
</div>

<section class="border-t border-b border-gray-300 bg-gray-50 ">
    <div class="mx-auto ">
        <div class="grid grid-cols-1 text-center md:grid-cols-3 divide-y md:divide-y-0 divide-x divide-gray-300">
            <div class="flex flex-col items-center h-full w-full bg-gray-50 lg:p-12 md:p-8 p-4">
                <Icon icon="mdi:map-marker" class="size-6 md:size-8 text-primary " />
                <h3 class="mt-auto text-lg font-medium tracking-tight text-black mb-2">Our Office</h3>
                <p class="text-gray-600 hover:text-primary">
                    Krepostnoy Lane, 147/251<br />
                    Rostov-on-Don, 344000, RUSSIA
                </p>
            </div>

            <div class="flex flex-col items-center h-full w-full bg-gray-50 lg:p-12 md:p-8 p-4">
                <Icon icon="mdi:email-outline" class="size-6 md:size-8 text-primary " />
                <h3 class="mt-auto text-lg font-medium tracking-tight text-black mb-2">Email Us</h3>
                <a
                    href="mailto:zindaeducation@mail.ru"
                    class="text-gray-600 hover:text-primary"
                >
                    zindaeducation@mail.ru
                </a>
            </div>

            <div class="flex flex-col items-center h-full w-full bg-gray-50 lg:p-12 md:p-8 p-4">
                <Icon icon="mdi:phone-outline" class="size-6 md:size-8 text-primary " />
                <h3 class="mt-auto text-lg font-medium tracking-tight text-black mb-2">Call Us</h3>
                <a href="tel:+79889979126" class="text-gray-600 hover:text-primary">
                    +7 (988) 9979126
                </a>
            </div>
        </div>
    </div>
</section>

<section class="bg-white py-20">
    <div class="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-8 lg:grid-cols-2">
        <div class="space-y-6">
            <h2 class="text-3xl font-medium tracking-tighter text-black">Send us a Message</h2>
            <form class="space-y-6" {onsubmit}>
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                    <div class="mt-1">
                        <Input
                            bind:value={formDetails.name}
                            type="text"
                            name="name"
                            icon="mdi:account-outline"
                            id="name"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="John Doe"
                        />
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <div class="mt-1">
                        <Input 
                            bind:value={formDetails.email}
                            type="email"
                            name="email"
                            icon="mdi:email-outline"
                            id="email"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="you@example.com"
                        />
                        <!-- <input
                            type="email"
                            name="email"
                            id="email"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="you@example.com"
                        /> -->
                    </div>
                </div>
                 <div>
                    <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
                    <div class="mt-1">
                        <Input
                            bind:value={formDetails.subject}
                            type="text"
                            name="subject"
                            icon="mdi:tag-outline"
                            id="subject"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="Regarding medical admissions"
                        />
                        <!-- <input
                            type="text"
                            name="subject"
                            id="subject"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="Regarding medical admissions"
                        /> -->
                    </div>
                </div>
                <div>
                    <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
                    <div class="mt-1">
                        <textarea

                            rows="4"
                            name="message"
                            id="message"
                            class="block w-full h-56 resize-none rounded-lg border-gray-300 focus:border-primary focus:ring-0 sm:text-sm"
                            placeholder="Your message..."
                            bind:value={formDetails.message}
                        ></textarea>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        class="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>

        <div class="h-full">
            <h2 class="text-3xl font-medium tracking-tighter text-black">Find Us Here</h2>
             <p class="mt-2 mb-6 text-gray-600">
                OOO {"<< ZINDA >>"} <br/>
                Krepostnoy Lane, 147/251<br />
                Rostov-on-Don, 344000, RUSSIA
            </p>
            <div class="h-[450px] w-full">
                <iframe
                    title="Zinda Consultancy Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2709.682823058866!2d39.73426867683933!3d47.22108421370591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40e3b9165d70f907%3A0x62c0733d062837f3!2sKrepostnoy%20Ln%2C%20147%2C%20Rostov-on-Don%2C%20Rostov%20Oblast%2C%20Russia%2C%20344019!5e0!3m2!1sen!2sin!4v1726500778747!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    class="rounded-2xl"
                    style="border:0;"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    </div>
</section>