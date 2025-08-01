import {createAuthClient} from "better-auth/react";

import {adminClient, organizationClient} from "better-auth/client/plugins";
import {env} from "@/env.mjs";
import {ac, user, admin as adminRole, pending, superadmin, orgAdmin, orgMember, orgOwner} from "./permissions";

export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_PROJECT_URL,
    plugins: [
        organizationClient({
            ac,
            roles: {
                owner: orgOwner,
                admin: orgAdmin,
                member: orgMember,
            },
        }),
        adminClient({
            ac,
            roles: {
                admin: adminRole,
                user,
                pending,
                superadmin,
            },
        }),
    ],
});

export const {signIn, signOut, signUp, useSession, listAccounts, admin} = authClient;
