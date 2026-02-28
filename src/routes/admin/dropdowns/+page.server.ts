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
    }
} satisfies Actions;
