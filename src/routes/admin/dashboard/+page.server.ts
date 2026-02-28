import { form1Repository, form2Repository } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const form1Data = await form1Repository.getSubmissions();
    const form2Data = await form2Repository.getSubmissions();

    // Aggregations for charts (Form 1 - Quality Issues)
    const partFailures = countOccurrences(form1Data, 'partNumber');
    const supplierIssues = countOccurrences(form1Data, 'supplier');
    const projectIssues = countOccurrences(form1Data, 'projectCode');
    const mfgFailures = countOccurrences(form1Data, 'mfgProcess');

    return {
        stats: {
            totalForm1: form1Data.length,
            totalForm2: form2Data.length,
        },
        charts: {
            partFailures,
            supplierIssues,
            projectIssues,
            mfgFailures
        },
        recentForm1: form1Data.slice(0, 10),
        recentForm2: form2Data.slice(0, 10),
        rawForm1: form1Data
    };
};

function countOccurrences(data: any[], key: string) {
    const counts: Record<string, number> = {};
    for (const item of data) {
        const val = item[key] || 'Unknown';
        counts[val] = (counts[val] || 0) + 1;
    }

    // Convert to arrays for chart.js
    const labels = Object.keys(counts);
    const values = Object.values(counts);

    return { labels, values };
}
