import { dropdownRepository } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const allOptions = await dropdownRepository.getOptions();

    const optionsByCategory = allOptions.reduce((acc, current) => {
        if (!acc[current.category]) acc[current.category] = [];

        let parsedValue = current.value;
        try {
            if (['Employee'].includes(current.category)) {
                parsedValue = JSON.parse(current.value);
            }
        } catch (e) {
            // keep as string if not valid JSON
        }

        acc[current.category].push(parsedValue);
        return acc;
    }, {} as Record<string, any[]>);

    return {
        dropdownOptions: optionsByCategory
    };
};
