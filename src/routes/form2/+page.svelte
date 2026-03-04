<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	const { dropdownOptions } = data;

	interface Part {
		no: string;
		name: string;
	}
	interface Vendor {
		code: string;
		name: string;
	}

	const parts = (dropdownOptions['Part'] || []) as unknown as Part[];
	const vendors = (dropdownOptions['Vendor'] || []) as unknown as Vendor[];

	const categories = {
		projectCode: dropdownOptions['Project Code'] || [],
		partNumber: parts.map((p) => p.no).filter(Boolean),
		partName: parts.map((p) => p.name).filter(Boolean),
		vendorCode: vendors.map((v) => v.code).filter(Boolean),
		vendorName: vendors.map((v) => v.name).filter(Boolean)
	};

	let isSubmitting = false;
	let isLookingUp = false;
	let lookupMessage = '';

	let partNumber = '';
	// Used for pre-filling
	let projectCode = '';
	let partName = '';
	let vendorCode = '';
	let vendorName = '';

	function onPartNumberChange() {
		if (partNumber) {
			const part = parts.find((p) => p.no === partNumber);
			if (part && partName !== part.name) partName = part.name;
		}
	}

	function onPartNameChange() {
		if (partName) {
			const part = parts.find((p) => p.name === partName);
			if (part && partNumber !== part.no) partNumber = part.no;
		}
	}

	function onVendorCodeChange() {
		if (vendorCode) {
			const vendor = vendors.find((v) => v.code === vendorCode);
			if (vendor && vendorName !== vendor.name) vendorName = vendor.name;
		}
	}

	function onVendorNameChange() {
		if (vendorName) {
			const vendor = vendors.find((v) => v.name === vendorName);
			if (vendor && vendorCode !== vendor.code) vendorCode = vendor.code;
		}
	}

	async function handlePartNumberBlur() {
		if (!partNumber.trim()) {
			lookupMessage = '';
			return;
		}

		onPartNumberChange(); // Just in case it hasn't triggered yet for autofill

		isLookingUp = true;
		lookupMessage = 'Looking up part number...';

		try {
			const response = await fetch(`/api/part-lookup?partNumber=${encodeURIComponent(partNumber)}`);
			const result = await response.json();

			if (result.found) {
				lookupMessage = 'Part found! Details auto-filled from previous submission.';
				projectCode = result.projectCode;
				partName = result.partName;
				vendorCode = result.vendorCode;
				vendorName = result.vendorName;
			} else {
				lookupMessage = 'Part not found in previous submissions. Please fill manually.';
			}
		} catch (e) {
			console.error(e);
			lookupMessage = 'Error looking up part details.';
		} finally {
			isLookingUp = false;
		}
	}
</script>

<div class="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
	<div class="bg-white rounded-2xl shadow-xl overflow-hidden">
		<div class="bg-indigo-600 py-6 px-8">
			<h1 class="text-3xl font-bold text-white">Part Applicability Submission</h1>
			<p class="mt-2 text-indigo-100">Submit new part details and applicability.</p>
		</div>

		<div class="p-8">
			{#if form?.success}
				<div class="mb-8 rounded-md bg-green-50 p-4 border border-green-200">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-green-800">Submission successful</h3>
						</div>
					</div>
				</div>
			{/if}

			{#if form?.error}
				<div class="mb-8 rounded-md bg-red-50 p-4 border border-red-200">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">Submission Error</h3>
							<div class="mt-1 text-sm text-red-700">{form.error}</div>
						</div>
					</div>
				</div>
			{/if}

			<form
				method="POST"
				class="space-y-8"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						update({ reset: true });
						partNumber = '';
						projectCode = '';
						partName = '';
						vendorCode = '';
						vendorName = '';
						lookupMessage = '';
					};
				}}
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
					<!-- Part lookup trigger -->
					<div class="md:col-span-2">
						<label for="partNumber" class="block text-sm font-medium text-gray-700"
							>Part Number</label
						>
						<div class="mt-1">
							<select
								name="partNumber"
								id="partNumber"
								required
								bind:value={partNumber}
								on:change={onPartNumberChange}
								on:blur={handlePartNumberBlur}
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
							>
								<option value="" disabled>Select Part No</option>
								{#each categories.partNumber as opt}
									<option value={opt}>{opt}</option>
								{/each}
							</select>
						</div>

						{#if lookupMessage}
							<p
								class={`mt-2 text-sm ${lookupMessage.includes('found!') ? 'text-green-600 font-medium' : 'text-gray-500'}`}
							>
								{lookupMessage}
							</p>
						{/if}
					</div>

					<div>
						<label for="partName" class="block text-sm font-medium text-gray-700">Part Name</label>
						<select
							name="partName"
							id="partName"
							required
							bind:value={partName}
							on:change={onPartNameChange}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
						>
							<option value="" disabled>Select Part Name</option>
							{#each categories.partName as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="projectCode" class="block text-sm font-medium text-gray-700"
							>Project Code</label
						>
						<select
							id="projectCode"
							name="projectCode"
							bind:value={projectCode}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
						>
							<option value="" disabled>Select Project Code</option>
							{#each categories.projectCode as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="vendorCode" class="block text-sm font-medium text-gray-700"
							>Vendor Code</label
						>
						<select
							id="vendorCode"
							name="vendorCode"
							bind:value={vendorCode}
							required
							on:change={onVendorCodeChange}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
						>
							<option value="" disabled>Select Vendor Code</option>
							{#each categories.vendorCode as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="vendorName" class="block text-sm font-medium text-gray-700"
							>Vendor Name</label
						>
						<select
							id="vendorName"
							name="vendorName"
							bind:value={vendorName}
							required
							on:change={onVendorNameChange}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
						>
							<option value="" disabled>Select Vendor Name</option>
							{#each categories.vendorName as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>

					<div class="md:col-span-2">
						<label for="applicability" class="block text-sm font-medium text-gray-700"
							>Applicability</label
						>
						<input
							type="text"
							name="applicability"
							id="applicability"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
						/>
					</div>

					<div class="md:col-span-2">
						<label for="dhrProject" class="block text-sm font-medium text-gray-700"
							>DHR / Project</label
						>
						<input
							type="text"
							name="dhrProject"
							id="dhrProject"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
						/>
					</div>
				</div>

				<div class="pt-5 flex justify-end gap-3">
					<a
						href="/"
						class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Cancel
					</a>
					<button
						type="submit"
						disabled={isSubmitting || isLookingUp}
						class="inline-flex justify-center flex-shrink-0 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
					>
						{isSubmitting ? 'Saving...' : 'Submit Subassembly'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
