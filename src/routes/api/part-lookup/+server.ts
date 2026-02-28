import { json } from '@sveltejs/kit';
import { form2Repository } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const partNumber = url.searchParams.get('partNumber');
    if (!partNumber) {
        return json({ error: 'Part number is required' }, { status: 400 });
    }

    try {
        const details = await form2Repository.getPartDetailsByNumber(partNumber);
        if (details) {
            return json({
                found: true,
                projectCode: details.projectCode,
                partName: details.partName,
                vendorCode: details.vendorCode,
                vendorName: details.vendorName
            });
        } else {
            return json({ found: false });
        }
    } catch (err) {
        console.error('Lookup error:', err);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
