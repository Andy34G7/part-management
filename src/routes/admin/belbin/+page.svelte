<script lang="ts">
    import { enhance } from '$app/forms';
    export let data;
    
    interface RoleDef {
        id: string;
        name: string;
        strength: string;
        weakness: string;
    }
    
    const ROLES: Record<string, RoleDef> = {
        sh: { id: 'sh', name: 'Shaper (SH)', strength: 'Challenging, dynamic, thrives on pressure.', weakness: 'Prone to provocation, offends people\'s feelings.' },
        im: { id: 'im', name: 'Implementer (IM)', strength: 'Disciplined, reliable, conservative, efficient.', weakness: 'Somewhat inflexible, slow to respond to new possibilities.' },
        cf: { id: 'cf', name: 'Completer Finisher (CF)', strength: 'Painstaking, conscientious, anxious.', weakness: 'Inclined to worry unduly, reluctant to delegate.' },
        co: { id: 'co', name: 'Coordinator (CO)', strength: 'Mature, confident, a good chairperson.', weakness: 'Can be seen as manipulative, offloads personal work.' },
        tw: { id: 'tw', name: 'Team Worker (TW)', strength: 'Co-operative, mild, perceptive, diplomatic.', weakness: 'Indecisive in crunch situations.' },
        ri: { id: 'ri', name: 'Resource Investigator (RI)', strength: 'Extrovert, enthusiastic, communicative.', weakness: 'Over-optimistic, loses interest once initial enthusiasm passes.' },
        pl: { id: 'pl', name: 'Plant (PL)', strength: 'Creative, imaginative, unorthodox.', weakness: 'Ignores incidentals, too up-in-the-clouds to communicate effectively.' },
        me: { id: 'me', name: 'Monitor Evaluator (ME)', strength: 'Sober, strategic, discerning.', weakness: 'Lacks drive and ability to inspire others.' },
        sp: { id: 'sp', name: 'Specialist (SP)', strength: 'Single-minded, self-starting, dedicated.', weakness: 'Contributes on a narrow front, dwells on technicalities.' },
    };

    let processedSubmissions = data.submissions.map(sub => {
        const roleScores = [
            { role: 'sh', score: sub.sh },
            { role: 'im', score: sub.im },
            { role: 'cf', score: sub.cf },
            { role: 'co', score: sub.co },
            { role: 'tw', score: sub.tw },
            { role: 'ri', score: sub.ri },
            { role: 'pl', score: sub.pl },
            { role: 'me', score: sub.me },
            { role: 'sp', score: sub.sp },
        ].sort((a, b) => b.score - a.score);

        return {
            ...sub,
            topRoles: roleScores.slice(0, 3).map(r => r.role)
        };
    });

    // Compute aggregate stats across the team (Top 3 preferences logic)
    let roleCounts: Record<string, number> = {
        sh: 0, im: 0, cf: 0, co: 0, tw: 0, ri: 0, pl: 0, me: 0, sp: 0
    };

    processedSubmissions.forEach(sub => {
        sub.topRoles.forEach(role => {
            roleCounts[role]++;
        });
    });

    const totalMembers = processedSubmissions.length;
    const missingRoles = Object.keys(roleCounts).filter(role => roleCounts[role] === 0);
    const surplusRoles = Object.keys(roleCounts).filter(role => roleCounts[role] >= (totalMembers / 2) && totalMembers > 0);

</script>

<div class="min-h-screen bg-gray-50 p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-8">
        
        <header class="flex flex-col md:flex-row md:items-center md:justify-between py-4">
            <div>
                <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Team Balance Sheet</h1>
                <p class="mt-2 text-sm text-gray-600">Overview of Belbin Team Roles composition across your organization.</p>
            </div>
            <div class="mt-4 md:mt-0">
                <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-800 shadow-sm border border-blue-200">
                    Total Team Members: {totalMembers}
                </span>
            </div>
        </header>

        <!-- Insights Modules -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Gaps -->
            <div class="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                <div class="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
                    <h3 class="text-lg font-bold text-red-900 flex items-center gap-2">
                        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Missing Roles or Gaps
                    </h3>
                </div>
                <div class="p-6">
                    {#if totalMembers === 0}
                        <p class="text-sm text-gray-500">Awaiting team data...</p>
                    {:else if missingRoles.length > 0}
                        <p class="text-sm text-gray-600 mb-4">The following roles have 0 people holding them in their top 3 preferences:</p>
                        <ul class="flex flex-wrap gap-2">
                            {#each missingRoles as role}
                                <li class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                                    {ROLES[role].name}
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <div class="flex items-center gap-2 text-green-700">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span class="text-sm font-medium">Excellent! Your team has balanced representation. No missing roles.</span>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Surpluses -->
            <div class="bg-white rounded-2xl shadow-sm border border-yellow-100 overflow-hidden">
                <div class="bg-yellow-50 px-6 py-4 border-b border-yellow-100 flex items-center justify-between">
                    <h3 class="text-lg font-bold text-yellow-900 flex items-center gap-2">
                        <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Over-represented Roles or Surpluses
                    </h3>
                </div>
                <div class="p-6">
                    {#if totalMembers === 0}
                        <p class="text-sm text-gray-500">Awaiting team data...</p>
                    {:else if surplusRoles.length > 0}
                        <p class="text-sm text-gray-600 mb-4">These roles define >= 50% of the team's top 3 preferences:</p>
                        <ul class="flex flex-wrap gap-2">
                            {#each surplusRoles as role}
                                <li class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                    {ROLES[role].name} ({Math.round(roleCounts[role] / totalMembers * 100)}%)
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <div class="flex items-center gap-2 text-green-700">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span class="text-sm font-medium">Good balance! No particular role heavily dominates the team.</span>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h3 class="text-lg font-bold text-gray-900">Individual Preferences</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-100">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Primary Preference</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Secondary Preference</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tertiary Preference</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {#if processedSubmissions.length === 0}
                            <tr>
                                <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">No self-perception inventories submitted yet.</td>
                            </tr>
                        {:else}
                            {#each processedSubmissions as sub}
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex flex-col">
                                            <div class="text-sm font-bold text-gray-900">{sub.empName}</div>
                                            <div class="text-sm text-gray-500">{sub.empNo}</div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
                                            {ROLES[sub.topRoles[0]].name}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700">
                                            {ROLES[sub.topRoles[1]].name}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700">
                                            {ROLES[sub.topRoles[2]].name}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <form method="POST" action="?/delete" use:enhance>
                                            <input type="hidden" name="id" value={sub.id} />
                                            <button type="submit" class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors text-xs font-bold">
                                                Revoke
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Role Reference Dictionary -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-8">
            <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h3 class="text-lg font-bold text-gray-900 flex items-center gap-4">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    Role Reference Dictionary
                </h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {#each Object.values(ROLES) as role}
                    <div class="relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div class="mb-4 pb-4 border-b border-gray-100 font-bold text-gray-900 border-l-4 border-l-blue-500 pl-4">
                            {role.name}
                        </div>
                        <div class="space-y-3">
                            <div>
                                <span class="text-xs font-bold uppercase tracking-wider text-green-600 block mb-1">Strength</span>
                                <span class="text-sm text-gray-700">{role.strength}</span>
                            </div>
                            <div>
                                <span class="text-xs font-bold uppercase tracking-wider text-red-500 block mb-1">Allowable Weakness</span>
                                <span class="text-sm text-gray-700">{role.weakness}</span>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

    </div>
</div>
