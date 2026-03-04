import { form1Repository, form2Repository } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

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

export const actions = {
    importForm1: async ({ request }) => {
        const data = await request.formData();
        const file = data.get('file') as File;

        if (!file || (file.type !== 'text/csv' && !file.name.endsWith('.csv'))) {
            return fail(400, { importError: 'Please upload a valid CSV file.' });
        }

        try {
            const text = await file.text();
            const Papa = (await import('papaparse')).default;
            const results = Papa.parse(text, { header: true, skipEmptyLines: true });

            if (results.errors.length > 0) {
                return fail(400, { importError: 'Error parsing CSV file format.' });
            }

            const parsedData = results.data as any[];
            const toInsert = [];

            for (const row of parsedData) {
                if (!row.empNo || !row.partNumber || !row.projectCode) continue;

                toInsert.push({
                    empNo: row.empNo,
                    empName: row.empName || '',
                    projectCode: row.projectCode,
                    partNumber: row.partNumber,
                    partName: row.partName || '',
                    supplier: row.supplier || '',
                    mfgProcess: row.mfgProcess || '',
                    typeOfIssue: row.typeOfIssue || '',
                    issue: row.issue || '',
                    failureMode: row.failureMode || '',
                    startingDate: row.startingDate || new Date().toISOString(),
                    endingDate: row.endingDate || new Date().toISOString(),
                    solution: row.solution || '',
                    standardisation: row.standardisation || '',
                    attachmentUrl: row.attachmentUrl || null
                });
            }

            if (toInsert.length > 0) {
                await form1Repository.createSubmissions(toInsert);
                return { importSuccess: `Successfully imported ${toInsert.length} Form 1 records.` };
            } else {
                return fail(400, { importError: 'No valid rows found to import.' });
            }
        } catch (error) {
            console.error('Import Form 1 Error:', error);
            return fail(500, { importError: 'Failed to import Form 1 data.' });
        }
    },
    importForm2: async ({ request }) => {
        const data = await request.formData();
        const file = data.get('file') as File;

        if (!file || (file.type !== 'text/csv' && !file.name.endsWith('.csv'))) {
            return fail(400, { importError: 'Please upload a valid CSV file.' });
        }

        try {
            const text = await file.text();
            const Papa = (await import('papaparse')).default;
            const results = Papa.parse(text, { header: true, skipEmptyLines: true });

            if (results.errors.length > 0) {
                return fail(400, { importError: 'Error parsing CSV file format.' });
            }

            const parsedData = results.data as any[];
            const toInsert = [];

            for (const row of parsedData) {
                if (!row.partNumber || !row.projectCode || !row.vendorCode) continue;

                toInsert.push({
                    projectCode: row.projectCode,
                    partNumber: row.partNumber,
                    partName: row.partName || '',
                    vendorCode: row.vendorCode,
                    vendorName: row.vendorName || '',
                    applicability: row.applicability || '',
                    dhrProject: row.dhrProject || ''
                });
            }

            if (toInsert.length > 0) {
                await form2Repository.createSubmissions(toInsert);
                return { importSuccess: `Successfully imported ${toInsert.length} Form 2 records.` };
            } else {
                return fail(400, { importError: 'No valid rows found to import.' });
            }
        } catch (error) {
            console.error('Import Form 2 Error:', error);
            return fail(500, { importError: 'Failed to import Form 2 data.' });
        }
    }
} satisfies Actions;
