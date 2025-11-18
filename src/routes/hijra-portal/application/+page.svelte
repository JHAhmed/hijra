<script>
	import DateField from "$components/ui/DateField.svelte";
	import Dropdown from "$components/ui/Dropdown.svelte";
	import FileInput from "$components/ui/FileInput.svelte";
	import Input from "$components/ui/Input.svelte";
	import PhoneInput from "$components/ui/PhoneInput.svelte";

    let values = $state({
        dropdown: null,
        file: null,
        input: '',
        phone: ''
    });

    let options = [
        {
            label: 'Option 1',
            value: 'option1'
        },
        {
            label: 'Option 2',
            value: 'option2'
        },
        {
            label: 'Option 3',
            value: 'option3'
        }
    ]

</script>

<div class="w-screen h-screen flex items-center justify-center flex-col space-y-4 max-w-lg mx-auto">


    <Input placeholder="Enter your application details..." label="Application Details" />
    <FileInput  bind:value={values.file}  name="file" label="Upload File" />
    <Dropdown items={options} placeholder="Select an option" bind:value={values.dropdown} label="Options" />
    <PhoneInput bind:value={values.phone} label="Phone Number" />
    <DateField label="Date of Birth" />

</div>