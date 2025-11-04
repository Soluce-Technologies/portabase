"use client"
import {createAuthClient} from "better-auth/react";

import {adminClient, inferAdditionalFields, organizationClient} from "better-auth/client/plugins";
import {ac, user, admin as adminRole, pending, superadmin, orgAdmin, orgMember, orgOwner} from "./permissions";
import {auth} from "@/lib/auth/auth";

const baseURL =
    typeof window === "undefined"
        ? process.env.PROJECT_URL // server side
        : "";

const res = await fetch(`${baseURL}/api/config`);
const { PROJECT_URL } = await res.json();

export const authClient = createAuthClient({
    baseURL: PROJECT_URL,
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
