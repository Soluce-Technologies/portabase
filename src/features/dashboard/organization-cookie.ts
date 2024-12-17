'use server';

import {cookies} from 'next/headers';


const COOKIE_NAME = 'PORTABASE_ORGANIZATION_SLUG';

export async function getCurrentOrganizationId() {
    return (await cookies()).get(COOKIE_NAME)?.value || "";
}

export async function setCurrentOrganizationId(slug: string) {
    return (await cookies()).set(COOKIE_NAME, slug).get(COOKIE_NAME)?.value;
}