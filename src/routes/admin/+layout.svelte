<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex h-screen bg-gray-100">
	<!-- Sidebar -->
	<aside class="w-64 bg-gray-900 text-white flex flex-col">
		<div class="h-16 flex items-center px-6 border-b border-gray-800">
			<h1 class="text-xl font-bold tracking-wider">Admin</h1>
		</div>
		<nav class="flex-1 px-4 py-6 space-y-2">
			<a
				href="/admin"
				class="flex items-center px-4 py-3 rounded-lg transition-colors {$page.url.pathname ===
				'/admin'
					? 'bg-blue-600 text-white'
					: 'text-gray-300 hover:bg-gray-800 hover:text-white'}"
			>
				<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
				Dashboard
			</a>
			<a
				href="/admin/dropdowns"
				class="flex items-center px-4 py-3 rounded-lg transition-colors {$page.url.pathname ===
				'/admin/dropdowns'
					? 'bg-blue-600 text-white'
					: 'text-gray-300 hover:bg-gray-800 hover:text-white'}"
			>
				<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
				Manage Dropdowns
			</a>
			<a
				href="/admin/belbin"
				class="flex items-center px-4 py-3 rounded-lg transition-colors {$page.url.pathname ===
				'/admin/belbin'
					? 'bg-green-600 text-white'
					: 'text-gray-300 hover:bg-gray-800 hover:hover:text-white'}"
			>
				<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
				Belbin Results
			</a>
		</nav>
		<div class="p-4 border-t border-gray-800">
			<a
				href="/logout"
				class="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					/>
				</svg>
				Logout
			</a>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
		<slot />
	</main>
</div>
