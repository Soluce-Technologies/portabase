import {createAuthClient} from "better-auth/react";

import {adminClient, inferAdditionalFields, organizationClient} from "better-auth/client/plugins";
import {env} from "@/env.mjs";
import {ac, user, admin as adminRole, pending, superadmin, orgAdmin, orgMember, orgOwner} from "./permissions";
import {auth} from "@/lib/auth/auth";

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
        inferAdditionalFields<typeof auth>(),
    ],

});

export const {signIn, signOut, signUp, useSession, listAccounts, admin} = authClient;
