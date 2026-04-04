import { belbinRepository } from '$lib/server/db';
import type { PageServerLoad } from './$types';

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
