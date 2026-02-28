<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
	<div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 border-b pb-4">
				Admin Login
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Sign in to access the dashboard.
			</p>
		</div>

		<form class="mt-8 space-y-6" method="POST">
			<div class="rounded-md shadow-sm -space-y-px">
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="appearance-none rounded relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
						placeholder="Admin Password"
					/>
				</div>
			</div>

			{#if form?.incorrect}
				<p class="text-red-500 text-sm text-center font-medium">
					Incorrect password. Please try again.
				</p>
			{/if}

			<div>
				<button
					type="submit"
					class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
				>
					Sign In
				</button>
			</div>
			<div class="text-center pt-2">
				<a href="/" class="text-sm font-medium text-blue-600 hover:text-blue-500">Back to Home</a>
			</div>
		</form>
	</div>
</div>
