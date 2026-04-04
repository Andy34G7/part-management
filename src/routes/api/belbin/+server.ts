import { json } from '@sveltejs/kit';
import { belbinRepository } from '$lib/server/db';
import { calculateBelbinScores } from '$lib/server/belbin';
import type { FormSection } from '$lib/server/belbin';

export async function GET() {
    try {
        const submissions = await belbinRepository.getSubmissions();
        return json(submissions);
    } catch (error) {
        console.error('Failed to get belbin submissions:', error);
        return json({ error: 'Failed to retrieve data' }, { status: 500 });
    }
}

export async function POST({ request }) {
    try {
        const data = await request.json();
        const { empNo, empName, sections } = data;

        if (!empNo || !empName || !sections || !Array.isArray(sections) || sections.length !== 7) {
            return json({ error: 'Invalid form data. Expected 7 sections, empNo, and empName.' }, { status: 400 });
        }

        // Validate that each section sums exactly to 10
        for (let i = 0; i < sections.length; i++) {
            const sum = Object.values(sections[i]).reduce((acc: number, val) => acc + Number(val || 0), 0);
            if (sum !== 10) {
                return json({ error: `Section ${i + 1} does not sum to 10 points.` }, { status: 400 });
            }
        }

        const calculatedScores = calculateBelbinScores(sections as FormSection[]);

        const newSubmission = await belbinRepository.createSubmission({
            empNo,
            empName,
            ...calculatedScores
        });

        return json(newSubmission, { status: 201 });
    } catch (error) {
        console.error('Failed to create belbin submission:', error);
        return json({ error: 'Failed to submit form' }, { status: 500 });
    }
}
