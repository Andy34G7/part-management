import { dropdownRepository, form2Repository } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const allOptions = await dropdownRepository.getOptions();

    const optionsByCategory = allOptions.reduce((acc, current) => {
        if (!acc[current.category]) acc[current.category] = [];
        acc[current.category].push(current.value);
        return acc;
    }, {} as Record<string, string[]>);

    return {
        dropdownOptions: optionsByCategory
    };
};

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        try {
            await form2Repository.createSubmission({
                projectCode: data.get('projectCode') as string,
                partNumber: data.get('partNumber') as string,
                partName: data.get('partName') as string,
                vendorCode: data.get('vendorCode') as string,
                vendorName: data.get('vendorName') as string,
                applicability: data.get('applicability') as string,
                dhrProject: data.get('dhrProject') as string,
            });

            return { success: true };
        } catch (error) {
            console.error('Error saving Form 2:', error);
            return fail(500, { error: 'Failed to save submission. Please try again.' });
        }
    }
} satisfies Actions;
