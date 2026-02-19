import { db } from '$lib/server/db';
import { parts } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const allParts = await db.select().from(parts).orderBy(parts.createdAt);
    return { parts: allParts };
};

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const quantity = parseInt(formData.get('quantity') as string);

        if (!name) return fail(400, { missing: true });

        await db.insert(parts).values({
            name,
            description,
            quantity: isNaN(quantity) ? 0 : quantity
        });

        return { success: true };
    }
};
