<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	const categories = ['Employee', 'Part', 'Vendor', 'Project Code', 'Mfg Process', 'Type of Issue'];

	let selectedCategory = categories[0];
	let isSubmitting = false;

	// Form binds
	let employeeNo = '';
	let employeeName = '';
	let partNo = '';
	let partName = '';
	let vendorCode = '';
	let vendorName = '';
	let simpleValue = '';

	$: optionsList = data.dropdownOptions[selectedCategory] || [];

	function formatDisplayValue(value: string, category: string): string {
		try {
			if (category === 'Employee' || category === 'Part' || category === 'Vendor') {
				const obj = JSON.parse(value);
				if (category === 'Employee') return `${obj.no} - ${obj.name}`;
				if (category === 'Part') return `${obj.no} - ${obj.name}`;
				if (category === 'Vendor') return `${obj.code} - ${obj.name}`;
			}
		} catch (e) {
			// Fallback to raw value if it's not valid JSON
		}
		return value;
	}

	function getSubmitValue() {
		if (selectedCategory === 'Employee') {
			return JSON.stringify({ no: employeeNo, name: employeeName });
		} else if (selectedCategory === 'Part') {
			return JSON.stringify({ no: partNo, name: partName });
		} else if (selectedCategory === 'Vendor') {
			return JSON.stringify({ code: vendorCode, name: vendorName });
		}
		return simpleValue;
	}
</script>

<div class="px-8 py-10 max-w-5xl mx-auto">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">Manage Dropdown Options</h1>
		<p class="mt-2 text-sm text-gray-600">
			Add or remove values that appear in the dropdown menus across Form 1 and Form 2.
		</p>
	</div>

	{#if form?.addError}
		<div class="mb-6 rounded-md bg-red-50 p-4 border border-red-200 text-red-700 text-sm">
			{form.addError}
		</div>
	{/if}
	{#if form?.deleteError}
		<div class="mb-6 rounded-md bg-red-50 p-4 border border-red-200 text-red-700 text-sm">
			{form.deleteError}
		</div>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
		<!-- Left Column: Category selector and Add form -->
		<div class="md:col-span-1 space-y-6">
			<!-- Category Selector -->
			<div class="bg-white p-6 shadow rounded-lg border border-gray-100">
				<label for="category-select" class="block text-sm font-medium text-gray-700 mb-2"
					>Select Category</label
				>
				<select
					id="category-select"
					bind:value={selectedCategory}
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
				>
					{#each categories as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
			</div>

			<!-- Add Option Form -->
			<div class="bg-white p-6 shadow rounded-lg border border-gray-100">
				<h3 class="text-lg font-medium text-gray-900 mb-4">Add Option to {selectedCategory}</h3>
				<form
					method="POST"
					action="?/addOption"
					use:enhance={({ formData }) => {
						isSubmitting = true;
						formData.set('value', getSubmitValue());
						return async ({ update }) => {
							isSubmitting = false;
							update({ reset: true });
							// Reset local binds
							employeeNo = '';
							employeeName = '';
							partNo = '';
							partName = '';
							vendorCode = '';
							vendorName = '';
							simpleValue = '';
						};
					}}
					class="space-y-4"
				>
					<input type="hidden" name="category" value={selectedCategory} />

					{#if selectedCategory === 'Employee'}
						<div>
							<label for="employeeNo" class="block text-sm font-medium text-gray-700 mb-1"
								>Employee Number</label
							>
							<input
								type="text"
								id="employeeNo"
								bind:value={employeeNo}
								required
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
							/>
						</div>
						<div>
							<label for="employeeName" class="block text-sm font-medium text-gray-700 mb-1"
								>Employee Name</label
							>
							<input
								type="text"
								id="employeeName"
								bind:value={employeeName}
								required
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
							/>
						</div>
					{:else if selectedCategory === 'Part'}
						<div>
							<label for="partNo" class="block text-sm font-medium text-gray-700 mb-1"
								>Part Number</label
							>
							<input
								type="text"
								id="partNo"
								bind:value={partNo}
								required
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
							/>
						</div>
						<div>
							<label for="partName" class="block text-sm font-medium text-gray-700 mb-1"
								>Part Name</label
							>
							<input
								type="text"
								id="partName"
								bind:value={partName}
								required
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
							/>
						</div>
					{:else if selectedCategory === 'Vendor'}
						<div>
							<label for="vendorCode" class="block text-sm font-medium text-gray-700 mb-1"
								>Vendor Code</label
							>
							<input
								type="text"
								id="vendorCode"
								bind:value={vendorCode}
								required
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
							/>
						</div>
						<div>
							<label for="vendorName" class="block text-sm font-medium text-gray-700 mb-1"
								>Vendor Name</label
							>
							<input
								type="text"
								id="vendorName"
								bind:value={vendorName}
								required
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
							/>
						</div>
					{:else}
						<div>
							<label for="simpleValue" class="block text-sm font-medium text-gray-700 mb-1"
								>Value</label
							>
							<input
								type="text"
								id="simpleValue"
								bind:value={simpleValue}
								required
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
							/>
						</div>
					{/if}

					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full inline-flex justify-center flex-shrink-0 py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
					>
						{isSubmitting ? 'Adding...' : 'Add Option'}
					</button>
				</form>
			</div>
		</div>

		<!-- Right Column: List of existing options -->
		<div class="md:col-span-2">
			<div class="bg-white shadow rounded-lg border border-gray-100 overflow-hidden">
				<div class="px-6 py-5 border-b border-gray-200">
					<h3 class="text-lg leading-6 font-medium text-gray-900">
						Current Options for <strong>{selectedCategory}</strong>
					</h3>
				</div>

				{#if optionsList.length === 0}
					<div class="p-6 text-center text-gray-500 text-sm">
						No options found for this category. Add one to see it here.
					</div>
				{:else}
					<ul class="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
						{#each optionsList as option}
							<li class="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
								<span class="text-sm font-medium text-gray-900"
									>{formatDisplayValue(option.value, selectedCategory)}</span
								>
								<form method="POST" action="?/deleteOption" use:enhance>
									<input type="hidden" name="id" value={option.id} />
									<button
										type="submit"
										title="Delete Option"
										class="text-red-500 hover:text-red-700 focus:outline-none focus:text-red-800 transition-colors p-1"
									>
										<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
												clip-rule="evenodd"
											/>
										</svg>
									</button>
								</form>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</div>
</div>
