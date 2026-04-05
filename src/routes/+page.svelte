<script lang="ts">
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<div class="flex justify-center mb-6">
			<div class="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
				<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					/>
				</svg>
			</div>
		</div>
		<h2 class="text-center text-3xl font-extrabold text-gray-900">Part Management System</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			Select a form to submit or access the admin dashboard.
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Form 1 Link -->
				<a
					href="/form1"
					class="group block p-6 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer"
				>
					<div class="flex items-center space-x-3 mb-3">
						<div class="bg-blue-100 p-2 rounded-lg text-blue-600">
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-medium text-gray-900 group-hover:text-blue-700">
							Form 1: Quality Issues
						</h3>
					</div>
					<p class="text-sm text-gray-500">
						Submit part failure details.
					</p>
					<div class="mt-4 flex items-center text-blue-600 text-sm font-medium">
						Open Form
						<svg
							class="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</div>
				</a>

				<!-- Form 2 Link -->
				<a
					href="/form2"
					class="group block p-6 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer"
				>
					<div class="flex items-center space-x-3 mb-3">
						<div class="bg-indigo-100 p-2 rounded-lg text-indigo-600">
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-medium text-gray-900 group-hover:text-indigo-700">
							Form 2: Part Order Details
						</h3>
					</div>
					<p class="text-sm text-gray-500">
						Submit new part orders.
					</p>
					<div class="mt-4 flex items-center text-indigo-600 text-sm font-medium">
						Open Form
						<svg
							class="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</div>
				</a>
			</div>

			<div class="mt-8 border-t border-gray-200 pt-6">
				<a
					href="/admin"
					class="flex justify-center flex-shrink-0 w-full py-3 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
				>
					Access Admin Dashboard
				</a>
			</div>
		</div>
	</div>
</div>
