<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	const { dropdownOptions } = data;

	interface Employee {
		no: string;
		name: string;
	}
	interface Part {
		no: string;
		name: string;
	}
	interface Vendor {
		code: string;
		name: string;
	}

	// Extract grouped options
	const employees = (dropdownOptions['Employee'] || []) as unknown as Employee[];
	const parts = (dropdownOptions['Part'] || []) as unknown as Part[];
	const vendors = (dropdownOptions['Vendor'] || []) as unknown as Vendor[];

	const categories = {
		empNo: employees.map((e) => e.no).filter(Boolean),
		empName: employees.map((e) => e.name).filter(Boolean),
		projectCode: dropdownOptions['Project Code'] || [],
		partNumber: parts.map((p) => p.no).filter(Boolean),
		partName: parts.map((p) => p.name).filter(Boolean),
		supplier: vendors.map((v) => v.name).filter(Boolean),
		mfgProcess: dropdownOptions['Mfg Process'] || [],
		typeOfIssue: dropdownOptions['Type of Issue'] || []
	};

	let selectedEmpNo: string = '';
	let selectedEmpName: string = '';
	let selectedPartNo: string = '';
	let selectedPartName: string = '';

	// Determine who changed to prevent cyclical loops
	function onEmpNoChange() {
		if (selectedEmpNo) {
			const emp = employees.find((e) => e.no === selectedEmpNo);
			if (emp && selectedEmpName !== emp.name) selectedEmpName = emp.name;
		}
	}

	function onEmpNameChange() {
		if (selectedEmpName) {
			const emp = employees.find((e) => e.name === selectedEmpName);
			if (emp && selectedEmpNo !== emp.no) selectedEmpNo = emp.no;
		}
	}

	function onPartNoChange() {
		if (selectedPartNo) {
			const part = parts.find((p) => p.no === selectedPartNo);
			if (part && selectedPartName !== part.name) selectedPartName = part.name;
		}
	}

	function onPartNameChange() {
		if (selectedPartName) {
			const part = parts.find((p) => p.name === selectedPartName);
			if (part && selectedPartNo !== part.no) selectedPartNo = part.no;
		}
	}

	let isSubmitting = false;
</script>

<div class="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
	<div class="bg-white rounded-2xl shadow-xl overflow-hidden">
		<div class="bg-blue-600 py-6 px-8">
			<h1 class="text-3xl font-bold text-white">Quality Issue Submission</h1>
			<p class="mt-2 text-blue-100">Please fill out all the required fields below.</p>
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
							<div class="mt-2 text-sm text-green-700">
								<p>Your quality issue report has been successfully recorded.</p>
							</div>
						</div>
					</div>
				</div>
			{/if}

			{#if form?.error}
				<div class="mb-8 rounded-md bg-red-50 p-4 border border-red-200">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg
								class="h-5 w-5 text-red-400"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
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
						selectedEmpNo = '';
						selectedEmpName = '';
						selectedPartNo = '';
						selectedPartName = '';
					};
				}}
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
					<!-- Employee Info -->
					<div>
						<label for="empNo" class="block text-sm font-medium text-gray-700"
							>Employee Number</label
						>
						<select
							id="empNo"
							name="empNo"
							required
							bind:value={selectedEmpNo}
							on:change={onEmpNoChange}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
						>
							<option value="" disabled selected>Select Emp No</option>
							{#each categories.empNo as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="empName" class="block text-sm font-medium text-gray-700"
							>Employee Name</label
						>
						<select
							id="empName"
							name="empName"
							required
							bind:value={selectedEmpName}
							on:change={onEmpNameChange}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
						>
							<option value="" disabled selected>Select Emp Name</option>
							{#each categories.empName as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>

					<!-- Project & Part Info -->
					<div>
						<label for="projectCode" class="block text-sm font-medium text-gray-700"
							>Project Code</label
						>
						<select
							id="projectCode"
							name="projectCode"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
						>
							<option value="" disabled selected>Select Project Code</option>
							{#each categories.projectCode as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="supplier" class="block text-sm font-medium text-gray-700">Supplier</label>
						<select
							id="supplier"
							name="supplier"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
						>
							<option value="" disabled selected>Select Supplier</option>
							{#each categories.supplier as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="partNumber" class="block text-sm font-medium text-gray-700"
							>Part Number</label
						>
						<select
							id="partNumber"
							name="partNumber"
							required
							bind:value={selectedPartNo}
							on:change={onPartNoChange}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
						>
							<option value="" disabled selected>Select Part No</option>
							{#each categories.partNumber as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="partName" class="block text-sm font-medium text-gray-700">Part Name</label>
						<select
							id="partName"
							name="partName"
							required
							bind:value={selectedPartName}
							on:change={onPartNameChange}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
						>
							<option value="" disabled selected>Select Part Name</option>
							{#each categories.partName as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>

					<!-- Issue Info -->
					<div>
						<label for="mfgProcess" class="block text-sm font-medium text-gray-700"
							>Mfg Process</label
						>
						<select
							id="mfgProcess"
							name="mfgProcess"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
						>
							<option value="" disabled selected>Select Mfg Process</option>
							{#each categories.mfgProcess as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="typeOfIssue" class="block text-sm font-medium text-gray-700"
							>Type of Issue</label
						>
						<select
							id="typeOfIssue"
							name="typeOfIssue"
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
						>
							<option value="" disabled selected>Select Issue Type</option>
							{#each categories.typeOfIssue as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Text Areas -->
				<div class="space-y-6 pt-4 border-t border-gray-200">
					<div>
						<label for="issue" class="block text-sm font-medium text-gray-700"
							>Issue Description</label
						>
						<div class="mt-1">
							<textarea
								id="issue"
								name="issue"
								rows="3"
								required
								class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border py-2 px-3"
							></textarea>
						</div>
					</div>

					<div>
						<label for="failureMode" class="block text-sm font-medium text-gray-700"
							>Failure Mode</label
						>
						<div class="mt-1">
							<textarea
								id="failureMode"
								name="failureMode"
								rows="2"
								required
								class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border py-2 px-3"
							></textarea>
						</div>
					</div>

					<!-- Date fields -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
						<div>
							<label for="startingDate" class="block text-sm font-medium text-gray-700"
								>Starting Date</label
							>
							<input
								type="date"
								name="startingDate"
								id="startingDate"
								required
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
							/>
						</div>
						<div>
							<label for="endingDate" class="block text-sm font-medium text-gray-700"
								>Ending Date</label
							>
							<input
								type="date"
								name="endingDate"
								id="endingDate"
								required
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
							/>
						</div>
					</div>

					<div>
						<label for="solution" class="block text-sm font-medium text-gray-700">Solution</label>
						<div class="mt-1">
							<textarea
								id="solution"
								name="solution"
								rows="3"
								required
								class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border py-2 px-3"
							></textarea>
						</div>
					</div>

					<div>
						<label for="standardisation" class="block text-sm font-medium text-gray-700"
							>Standardisation</label
						>
						<div class="mt-1">
							<textarea
								id="standardisation"
								name="standardisation"
								rows="2"
								required
								class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border py-2 px-3"
							></textarea>
						</div>
					</div>

					{#if false}
						<div>
							<label for="attachment" class="block text-sm font-medium text-gray-700"
								>Attachment (Optional placeholder)</label
							>
							<div
								class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md upload-area hover:bg-gray-50 transition-colors"
							>
								<div class="space-y-1 text-center">
									<svg
										class="mx-auto h-12 w-12 text-gray-400"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 48 48"
										aria-hidden="true"
									>
										<path
											d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
									<div class="flex text-sm text-gray-600 justify-center">
										<label
											for="file-upload"
											class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
										>
											<span>Upload a file</span>
											<input id="file-upload" name="file-upload" type="file" class="sr-only" />
										</label>
										<p class="pl-1">or drag and drop</p>
									</div>
									<p class="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<div class="pt-5 flex justify-end gap-3">
					<a
						href="/"
						class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Cancel
					</a>
					<button
						type="submit"
						disabled={isSubmitting}
						class="inline-flex justify-center flex-shrink-0 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
					>
						{isSubmitting ? 'Saving...' : 'Submit Issue'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
