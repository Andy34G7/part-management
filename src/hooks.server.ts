import { redirect, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const handle: Handle = async ({ event, resolve }) => {
    const authCookie = event.cookies.get('admin_session');

    if (event.url.pathname.startsWith('/admin')) {
        const password = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
        if (!authCookie || !password || authCookie !== password) {
            throw redirect(303, '/login');
        }
    }

    return resolve(event);
};
