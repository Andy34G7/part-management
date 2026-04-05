import { dropdownRepository, belbinRepository } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const allOptions = await dropdownRepository.getOptions();
    const submissions = await belbinRepository.getSubmissions();
    const submittedEmpNos = new Set(submissions.map(s => s.empNo));

    const optionsByCategory = allOptions.reduce((acc, current) => {
        if (!acc[current.category]) acc[current.category] = [];

        let parsedValue: any = current.value;
        try {
            if (['Employee'].includes(current.category)) {
                parsedValue = JSON.parse(current.value);
                if (submittedEmpNos.has(parsedValue.no)) return acc;
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
