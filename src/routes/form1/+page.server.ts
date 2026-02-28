import { dropdownRepository, form1Repository } from '$lib/server/db';
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
            await form1Repository.createSubmission({
                empNo: data.get('empNo') as string,
                empName: data.get('empName') as string,
                projectCode: data.get('projectCode') as string,
                partNumber: data.get('partNumber') as string,
                partName: data.get('partName') as string,
                supplier: data.get('supplier') as string,
                mfgProcess: data.get('mfgProcess') as string,
                typeOfIssue: data.get('typeOfIssue') as string,
                issue: data.get('issue') as string,
                failureMode: data.get('failureMode') as string,
                startingDate: data.get('startingDate') as string,
                endingDate: data.get('endingDate') as string,
                solution: data.get('solution') as string,
                standardisation: data.get('standardisation') as string,
                attachmentUrl: (data.get('attachmentUrl') as string) || null,
            });

            return { success: true };
        } catch (error) {
            console.error('Error saving Form 1:', error);
            return fail(500, { error: 'Failed to save submission. Please try again.' });
        }
    }
} satisfies Actions;
