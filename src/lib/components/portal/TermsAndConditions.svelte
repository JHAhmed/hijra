<script>
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte';

	const dispatch = createEventDispatcher();
	let agreed = $state(false);

	function handleAgree() {
		if (agreed) {
			dispatch('agree');
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
	<div
		class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
	>
		<!-- Header -->
		<div class="border-b border-gray-100 px-6 py-4">
			<h2 class="text-xl font-semibold text-gray-800">Terms and Conditions</h2>
			<p class="text-sm text-gray-500">Please read and agree to proceed.</p>
		</div>

		<!-- Scrollable Content -->
		<div class="flex-1 overflow-y-auto px-6 py-4 text-sm leading-relaxed text-gray-600">
			<ol class="list-decimal space-y-4 pl-4">
				<li>
					<span class="font-medium text-gray-800">Travel Commitment:</span> A person undertaking Hajj/Umrah
					must travel on the date registered. If unexpectedly unable to travel, the flight ticket cannot
					be cancelled for a refund. If the administration arranges travel on an alternate date, the
					traveler must bear the fare difference and transport costs. The travel date will be confirmed
					10 days in advance.
				</li>
				<li>
					<span class="font-medium text-gray-800">Accommodation Rules:</span> In Makkah and Madinah,
					accommodation rules set by the local administration (approved by the Saudi government) must
					be accepted. Men and women will be housed separately (no concessions for family/group arrangements).
					The destination (Makkah or Madinah) will be informed to pilgrims 2 days before departure.
				</li>
				<li>
					<span class="font-medium text-gray-800">Schedule Changes:</span> If, due to announcements by
					the Saudi government, airline, or visa company, the registered travel date or return date (14+1
					= 15 days) changes or extends, the traveler must willingly bear the fare difference and the
					costs of extra days for lodging and food.
				</li>
				<li>
					<span class="font-medium text-gray-800">Cost Fluctuations:</span> If there is an increase in
					“Visa Stamping Fee” or flight ticket fare due to foreign exchange rate changes, travelers must
					kindly pay the difference.
				</li>
				<li>
					<span class="font-medium text-gray-800">Visa Processing:</span> If there is a delay in obtaining
					the Saudi visa, I agree to travel on the rescheduled date. If the visa is not granted and the
					trip is cancelled, I will receive the balance amount after deducting ticket cancellation charges
					and administrative expenses.
				</li>
				<li>
					<span class="font-medium text-gray-800">Baggage Allowance:</span> From India, each person is
					allowed only 15 kg (one bag/suitcase). On return, 30 kg (two bags/suitcases) are allowed. Additionally,
					for Tamil Nadu cuisine, each pilgrim must carry one luggage item on behalf of the company.
				</li>
				<li>
					<span class="font-medium text-gray-800">Mahram Requirement:</span> Women under 45 years and
					men under 40 years must apply with a valid Mahram. (For women: father/husband/son/brother.
					For men: mother/wife/daughter/sister). If the Mahram is unable to travel due to financial, health,
					accident, or death reasons, the associated woman/man cannot travel alone. In such cases, visa
					fees, hotel charges, ticket cancellation charges, and administrative expenses will be deducted,
					and the balance refunded.
				</li>
				<li>
					<span class="font-medium text-gray-800">Health Declaration:</span> I confirm that there are
					no pregnant women in our group. If false information is given, we alone are responsible (traveler).
				</li>
				<li>
					<span class="font-medium text-gray-800">Medical & Emergency:</span> Any medical expenses due
					to illness, hospital visits, doctor’s fees, medicines, and transport must be borne by the concerned
					person. In case of unexpected death during travel, the family of the pilgrim must bear the expenses,
					and I agree to be buried in Saudi Arabia.
				</li>
				<li>
					<span class="font-medium text-gray-800">Adherence to Schedule:</span> All time schedules announced
					by the administration must be strictly followed — especially meal times (morning, afternoon,
					night), ziyarat trips, Makkah–Madinah bus journeys, departure timings, and airport transfers.
				</li>
				<li>
					<span class="font-medium text-gray-800">Visitor Policy:</span> Without prior permission from
					Al Maqam Hajj Umrah administration, no outsider is allowed to stay with pilgrims in Makkah or
					Madinah hotels. If required, permission must be obtained and full charges paid.
				</li>
				<li>
					<span class="font-medium text-gray-800">Departures:</span> Insha Allah, every year Umrah departures
					will begin as soon as “Umrah Stamping” starts.
				</li>
				<li>
					<span class="font-medium text-gray-800">Stay Duration:</span> Makkah stay will be 7, 8, or
					9 days; Madinah stay will be 6, 5, or 4 days.
				</li>
			</ol>
		</div>

		<!-- Footer -->
		<div class="border-t border-gray-100 bg-gray-50 px-6 py-4">
			<label class="flex cursor-pointer items-start gap-3">
				<div class="relative flex items-center pt-0.5">
					<input
						type="checkbox"
						bind:checked={agreed}
						class="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white transition-all checked:border-primary checked:bg-primary hover:border-primary focus:ring-2 focus:ring-primary/20"
					/>
					<Icon
						icon="ph:check-bold"
						class="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
					/>
				</div>
				<span class="text-sm text-gray-700 select-none">
					I have read and agree to the Terms and Conditions stated above.
				</span>
			</label>

			<button
				onclick={handleAgree}
				disabled={!agreed}
				class="mt-4 flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
			>
				Proceed to Application
			</button>
		</div>
	</div>
</div>
