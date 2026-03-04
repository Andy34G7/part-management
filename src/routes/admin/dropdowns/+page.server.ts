import { dropdownRepository } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const allOptions = await dropdownRepository.getOptions();

    const optionsByCategory = allOptions.reduce((acc, current) => {
        if (!acc[current.category]) acc[current.category] = [];
        acc[current.category].push({ id: current.id, value: current.value });
        return acc;
    }, {} as Record<string, { id: number, value: string }[]>);

    return {
        dropdownOptions: optionsByCategory
    };
};

export const actions = {
    addOption: async ({ request }) => {
        const data = await request.formData();
        const category = data.get('category') as string;
        const value = data.get('value') as string;

        if (!category || !value) {
            return fail(400, { addError: 'Category and value are required.' });
        }

        try {
            await dropdownRepository.addOption({ category, value });
            return { success: true };
        } catch (error) {
            console.error('Error adding option:', error);
            return fail(500, { addError: 'Failed to add option.' });
        }
    },
    deleteOption: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');

        if (!id) {
            return fail(400, { deleteError: 'Option ID is required.' });
        }

        try {
            await dropdownRepository.deleteOption(Number(id));
            return { success: true };
        } catch (error) {
            console.error('Error deleting option:', error);
            return fail(500, { deleteError: 'Failed to delete option.' });
        }
    },
    batchUpload: async ({ request }) => {
        const data = await request.formData();
        const category = data.get('category') as string;
        const file = data.get('file') as File;

        if (!category || !file) {
            return fail(400, { addError: 'Category and CSV file are required.' });
        }

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            return fail(400, { addError: 'Uploaded file must be a CSV.' });
        }

        try {
            const text = await file.text();

            // Dynamic import to avoid SSR issues if any, though it's node env
            const Papa = (await import('papaparse')).default;

            const results = Papa.parse(text, { header: true, skipEmptyLines: true });
            if (results.errors.length > 0) {
                return fail(400, { addError: 'Error parsing CSV file. Please check format.' });
            }

            const parsedData = results.data as any[];
            const toInsert = [];

            for (const row of parsedData) {
                let value = '';
                if (category === 'Employee') {
                    if (!row.no || !row.name) continue;
                    value = JSON.stringify({ no: row.no.trim(), name: row.name.trim() });
                } else if (category === 'Part') {
                    if (!row.no || !row.name) continue;
                    value = JSON.stringify({ no: row.no.trim(), name: row.name.trim() });
                } else if (category === 'Vendor') {
                    if (!row.code || !row.name) continue;
                    value = JSON.stringify({ code: row.code.trim(), name: row.name.trim() });
                } else {
                    if (!row.value) continue;
                    value = row.value.trim();
                }

                if (value) {
                    toInsert.push({ category, value });
                }
            }

            if (toInsert.length > 0) {
                await dropdownRepository.addOptions(toInsert);
            } else {
                return fail(400, { addError: 'No valid rows found to insert (check column headers).' });
            }

            return { success: true };
        } catch (error) {
            console.error('Error batch uploading options:', error);
            return fail(500, { addError: 'Failed to batch upload options.' });
        }
    }
} satisfies Actions;
