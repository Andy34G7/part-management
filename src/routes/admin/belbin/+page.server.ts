import { belbinRepository } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const submissions = await belbinRepository.getSubmissions();
        return {
            submissions
        };
    } catch (error) {
        console.error('Failed to load belbin submissions:', error);
        return {
            submissions: []
        };
    }
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        if (id) {
            await belbinRepository.deleteSubmission(Number(id));
        }
    }
};
