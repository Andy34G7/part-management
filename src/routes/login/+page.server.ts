import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const password = data.get('password');

        if (!password || password.toString() !== env.ADMIN_PASSWORD) {
            return fail(400, { incorrect: true });
        }

        cookies.set('admin_session', password.toString(), {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        throw redirect(303, '/admin');
    }
} satisfies Actions;
