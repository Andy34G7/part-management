import { form1Repository, form2Repository } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const type = url.searchParams.get('type');

    let data: any[] = [];
    let filename = 'export.csv';

    try {
        if (type === 'form1') {
            data = await form1Repository.getSubmissions();
            filename = 'quality_issues_export.csv';
        } else if (type === 'form2') {
            data = await form2Repository.getSubmissions();
            filename = 'part_applicability_export.csv';
        } else {
            return new Response('Invalid export type', { status: 400 });
        }

        if (data.length === 0) {
            return new Response('No data to export', { status: 404 });
        }

        // Generate CSV
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row =>
            Object.values(row).map(value => {
                // Escape quotes and wrap strings in quotes to handle commas
                if (value instanceof Date) {
                    return `"${value.toISOString()}"`;
                }
                if (typeof value === 'string') {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        );

        const csvContent = [headers, ...rows].join('\n');

        return new Response(csvContent, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        });

    } catch (err) {
        console.error('Export error:', err);
        return new Response('Internal Server Error', { status: 500 });
    }
};
