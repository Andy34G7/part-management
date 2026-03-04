<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';

	interface CustomActionData {
		importError?: string;
		importSuccess?: string;
	}

	export let form: CustomActionData;

	let form1El: HTMLFormElement;
	let form2El: HTMLFormElement;

	// Need to dynamically import Chart to avoid SSR issues
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		BarElement,
		CategoryScale,
		LinearScale,
		ArcElement,
		BarController,
		PieController,
		type ChartConfiguration
	} from 'chart.js';

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		BarElement,
		CategoryScale,
		LinearScale,
		ArcElement,
		BarController,
		PieController
	);

	export let data: PageData;
	const { stats, charts, recentForm1 } = data;

	const barOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false }
		}
	};

	const getChartData = (
		label: string,
		chartData: { labels: string[]; values: number[] },
		colors: string[]
	) => ({
		labels: chartData.labels,
		datasets: [
			{
				label,
				data: chartData.values,
				backgroundColor: colors,
				borderWidth: 1
			}
		]
	});

	const generateColors = (count: number) => {
		const baseColors = [
			'rgba(59, 130, 246, 0.8)', // blue
			'rgba(16, 185, 129, 0.8)', // green
			'rgba(245, 158, 11, 0.8)', // yellow
			'rgba(239, 68, 68, 0.8)', // red
			'rgba(139, 92, 246, 0.8)', // purple
			'rgba(236, 72, 153, 0.8)' // pink
		];
		return Array(count)
			.fill(0)
			.map((_, i) => baseColors[i % baseColors.length]);
	};

	function renderChart(node: HTMLCanvasElement, config: ChartConfiguration) {
		let chart = new ChartJS(node, config);
		return {
			update(newConfig: ChartConfiguration) {
				chart.data = newConfig.data;
				if (newConfig.options) {
					chart.options = newConfig.options;
				}
				chart.update();
			},
			destroy() {
				chart.destroy();
			}
		};
	}

	let customX = 'supplier';
	let customY = 'none';

	const dimensions = [
		{ value: 'supplier', label: 'Supplier' },
		{ value: 'partNumber', label: 'Part Number' },
		{ value: 'projectCode', label: 'Project Code' },
		{ value: 'mfgProcess', label: 'Manufacturing Process' },
		{ value: 'typeOfIssue', label: 'Type of Issue' },
		{ value: 'failureMode', label: 'Failure Mode' },
		{ value: 'empName', label: 'Employee' }
	];

	$: customChartData = computeCustomChart(data.rawForm1 || [], customX, customY);

	function computeCustomChart(rawData: any[], xKey: string, yKey: string) {
		const xValues = Array.from(new Set(rawData.map((item) => item[xKey] || 'Unknown')));
		if (yKey === 'none') {
			const dataCounts = xValues.map((xVal) => {
				return rawData.filter((item) => (item[xKey] || 'Unknown') === xVal).length;
			});
			return {
				labels: xValues,
				datasets: [
					{
						label: 'Total Count',
						data: dataCounts,
						backgroundColor: generateColors(xValues.length),
						borderWidth: 1
					}
				]
			};
		}

		const yValues = Array.from(new Set(rawData.map((item) => item[yKey] || 'Unknown')));
		const colors = generateColors(yValues.length);

		const datasets = yValues.map((yVal, i) => {
			const dataCounts = xValues.map((xVal) => {
				return rawData.filter(
					(item) => (item[xKey] || 'Unknown') === xVal && (item[yKey] || 'Unknown') === yVal
				).length;
			});
			return {
				label: yVal,
				data: dataCounts,
				backgroundColor: colors[i % colors.length],
				borderWidth: 1
			};
		});

		return {
			labels: xValues,
			datasets
		};
	}
</script>

<div class="px-8 py-10 max-w-7xl mx-auto space-y-8">
	<div
		class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5"
	>
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
			<p class="mt-2 text-sm text-gray-600">Analytics and recent submissions across forms.</p>
		</div>
		<div class="grid grid-cols-2 gap-3 mt-4 md:mt-0">
			<form
				action="?/importForm1"
				method="POST"
				enctype="multipart/form-data"
				class="flex"
				bind:this={form1El}
			>
				<label
					for="file-form1"
					class="cursor-pointer w-full justify-center inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
				>
					<span>Import Form 1</span>
					<input
						id="file-form1"
						name="file"
						type="file"
						accept=".csv"
						class="sr-only"
						on:change={() => form1El?.submit()}
					/>
				</label>
			</form>
			<a
				href="/api/export?type=form1"
				class="inline-flex justify-center items-center px-4 py-2 border border-blue-600 shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				Export Form 1
			</a>
			<form
				action="?/importForm2"
				method="POST"
				enctype="multipart/form-data"
				class="flex"
				bind:this={form2El}
			>
				<label
					for="file-form2"
					class="cursor-pointer w-full justify-center inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
				>
					<span>Import Form 2</span>
					<input
						id="file-form2"
						name="file"
						type="file"
						accept=".csv"
						class="sr-only"
						on:change={() => form2El?.submit()}
					/>
				</label>
			</form>
			<a
				href="/api/export?type=form2"
				class="inline-flex justify-center items-center px-4 py-2 border border-blue-600 shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				Export Form 2
			</a>
		</div>
	</div>

	{#if form?.importError}
		<div class="rounded-md bg-red-50 p-4 border border-red-200 text-red-700 text-sm">
			{form.importError}
		</div>
	{/if}
	{#if form?.importSuccess}
		<div class="rounded-md bg-green-50 p-4 border border-green-200 text-green-700 text-sm">
			{form.importSuccess}
		</div>
	{/if}

	<!-- Stat Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="bg-white rounded-xl shadow border border-gray-100 p-6 flex items-center shadow-sm">
			<div class="p-4 rounded-full bg-blue-100 text-blue-600 mr-5">
				<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			</div>
			<div>
				<p class="text-sm font-medium text-gray-500 uppercase tracking-wide">
					Total Quality Issues
				</p>
				<p class="text-3xl font-bold text-gray-900">{stats.totalForm1}</p>
			</div>
		</div>
		<div class="bg-white rounded-xl shadow border border-gray-100 p-6 flex items-center shadow-sm">
			<div class="p-4 rounded-full bg-indigo-100 text-indigo-600 mr-5">
				<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					/>
				</svg>
			</div>
			<div>
				<p class="text-sm font-medium text-gray-500 uppercase tracking-wide">
					Total Applicability Form 2
				</p>
				<p class="text-3xl font-bold text-gray-900">{stats.totalForm2}</p>
			</div>
		</div>
	</div>

	<!-- Dynamic Chart Section -->
	<div
		class="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-200 p-6 relative overflow-hidden"
	>
		<!-- Decorative Background Element -->
		<div
			class="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full opacity-5 blur-3xl pointer-events-none"
		></div>

		<div class="flex flex-col xl:flex-row justify-between xl:items-center mb-6 gap-6 relative z-10">
			<div>
				<h3 class="text-xl font-extrabold text-blue-900 tracking-tight">
					Dynamic Correlation Analysis
				</h3>
				<p class="text-sm text-gray-500 mt-1 font-medium">
					Plot different data dimensions against each other
				</p>
			</div>

			<div
				class="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
			>
				<div class="flex items-center gap-3 w-full sm:w-auto">
					<label
						for="customX"
						class="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
						>X-Axis</label
					>
					<select
						id="customX"
						bind:value={customX}
						class="block w-full sm:w-48 pl-3 pr-8 py-2 text-sm border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition-colors cursor-pointer font-medium text-gray-800"
					>
						{#each dimensions as dim}
							<option value={dim.value}>{dim.label}</option>
						{/each}
					</select>
				</div>

				<div
					class="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-400 font-bold shrink-0"
				>
					vs
				</div>
				<div
					class="flex items-center justify-center w-full sm:hidden text-blue-400 font-bold text-sm my-1"
				>
					VS
				</div>

				<div class="flex items-center gap-3 w-full sm:w-auto">
					<label
						for="customY"
						class="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
						>Group By</label
					>
					<select
						id="customY"
						bind:value={customY}
						class="block w-full sm:w-48 pl-3 pr-8 py-2 text-sm border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-lg transition-colors cursor-pointer font-medium text-gray-800"
					>
						<option value="none">None (Total Count)</option>
						{#each dimensions as dim}
							{#if dim.value !== customX}
								<option value={dim.value}>{dim.label}</option>
							{/if}
						{/each}
					</select>
				</div>
			</div>
		</div>

		<div class="h-[400px] w-full relative z-10 bg-white rounded-lg border border-gray-100 p-2">
			<canvas
				use:renderChart={{
					type: 'bar',
					data: customChartData,
					options: {
						responsive: true,
						maintainAspectRatio: false,
						scales: {
							x: { stacked: customY !== 'none', grid: { display: false } },
							y: {
								stacked: customY !== 'none',
								grid: { color: '#f3f4f6' },
								border: { dash: [4, 4] }
							}
						},
						plugins: {
							legend: { display: customY !== 'none', position: 'right' }
						}
					}
				}}
			></canvas>
		</div>
	</div>

	<!-- Charts -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<div class="bg-white rounded-xl shadow border border-gray-100 p-6">
			<h3 class="text-lg font-bold text-gray-900 mb-4">Failures by Part Number</h3>
			<div class="h-64 relative w-full">
				<canvas
					use:renderChart={{
						type: 'bar',
						data: getChartData(
							'Failures',
							charts.partFailures,
							generateColors(charts.partFailures.labels.length)
						),
						options: barOptions
					}}
				></canvas>
			</div>
		</div>
		<div class="bg-white rounded-xl shadow border border-gray-100 p-6">
			<h3 class="text-lg font-bold text-gray-900 mb-4">Issues by Supplier</h3>
			<div class="h-64 relative w-full">
				<canvas
					use:renderChart={{
						type: 'bar',
						data: getChartData(
							'Issues',
							charts.supplierIssues,
							generateColors(charts.supplierIssues.labels.length)
						),
						options: barOptions
					}}
				></canvas>
			</div>
		</div>
		<div class="bg-white rounded-xl shadow border border-gray-100 p-6 flex flex-col items-center">
			<h3 class="text-lg font-bold text-gray-900 mb-4 w-full text-left">Issues by Project Code</h3>
			<div class="h-64 w-full max-w-sm relative">
				<canvas
					use:renderChart={{
						type: 'pie',
						data: getChartData(
							'Project Code',
							charts.projectIssues,
							generateColors(charts.projectIssues.labels.length)
						),
						options: { responsive: true, maintainAspectRatio: false }
					}}
				></canvas>
			</div>
		</div>
		<div class="bg-white rounded-xl shadow border border-gray-100 p-6">
			<h3 class="text-lg font-bold text-gray-900 mb-4">Failures by Mfg Process</h3>
			<div class="h-64 relative w-full">
				<canvas
					use:renderChart={{
						type: 'bar',
						data: getChartData(
							'Process Failures',
							charts.mfgFailures,
							generateColors(charts.mfgFailures.labels.length)
						),
						options: barOptions
					}}
				></canvas>
			</div>
		</div>
	</div>

	<!-- Recent Submissions Table -->
	<div class="bg-white rounded-xl shadow border border-gray-100 overflow-hidden mt-8">
		<div class="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
			<h3 class="text-lg leading-6 font-bold text-gray-900">Recent Quality Issues</h3>
		</div>
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Date</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Part Number</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Supplier</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Issue Type</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Failure Mode</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Employee</th
						>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each recentForm1 as sub}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
								>{new Date(sub.createdAt).toLocaleDateString()}</td
							>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
								>{sub.partNumber}</td
							>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.supplier}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								<span
									class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
								>
									{sub.typeOfIssue}
								</span>
							</td>
							<td class="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{sub.failureMode}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.empName}</td>
						</tr>
					{/each}
					{#if recentForm1.length === 0}
						<tr>
							<td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">
								No quality issues have been submitted yet.
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
