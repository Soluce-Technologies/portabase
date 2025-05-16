import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { env } from "@/env.mjs";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, openAPI, organization } from "better-auth/plugins";
import { ac, admin, user, pending, superadmin, orgOwner, orgAdmin, orgMember } from "@/lib/auth/permissions";

import { headers } from "next/headers";
import { count, eq } from "drizzle-orm";
import * as drizzleUser from "@/db/schema/01_user";
import * as drizzleOrganization from "@/db/schema/02_organization";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...drizzleUser,
            ...drizzleOrganization,
        },
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        /*async sendResetPassword(data, request) {
            // Send an email to the user with a link to reset their password
        },
        async sendVerificationEmail(data, request) {
            // Send an email to the user with a link to verify their email
        },
        async verifyEmail(data, request) {
            // Verify the email address
        },*/
    },
    socialProviders: {
        google: {
            clientId: env.AUTH_GOOGLE_ID!,
            clientSecret: env.AUTH_GOOGLE_SECRET!,
        },
    },
    plugins: [
        openAPI(),
        nextCookies(),
        organization({
            ac,
            roles: {
                orgOwner,
                orgAdmin,
                orgMember,
            },
        }),
        adminPlugin({
            adminRoles: ["admin", "superadmin"],
            defaultRole: (await db.select({ count: count() }).from(drizzleUser["user"]))[0].count === 0 ? "superadmin" : "pending",
            ac,
            roles: {
                admin,
                user,
                pending,
                superadmin,
            },
        }),
    ],
    advanced: {
        database: {
            generateId: false,
        },
    },
    user: {
        additionalFields: {
            deletedAt: {
                type: "number", //pg timestamp
                nullable: true,
                required: false,
            },
        },
    },
    session: {
        additionalFields: {
            activeOrganizationId: {
                type: "string",
                required: false,
            },
        },
    },
    /*    databaseHooks: {
        session: {
            create: {
                before: async (session) => {
                    const organizationId = await getLastOrganizationOrFirst(session.userId);

                    if (!organizationId) {
                        return {
                            ...session,
                        };
                    }

                    console.log("sessionId", session.id);

                    const [aa] = await db
                        .update(drizzleUser.session)
                        .set({ activeOrganizationId: organizationId })
                        .where(eq(drizzleUser.session.id, session.id))
                        .returning();

                    console.log("aaaaa", aa);

                    return {
                        ...session,
                        activeOrganizationId: organizationId,
                    };
                },
            },
        },
    },*/
    trustedOrigins: [env.NEXT_PUBLIC_PROJECT_URL, "http://app"],
});

/*export const signUpUser = async (email: string, password: string, name: string) => {
    const user = await auth.api.signUpEmail({
        body: {
            email,
            password,
            name,
        },
    });

    return user;
};

export const signInUser = async (email: string, password: string) => {
    const user = await auth.api.signInEmail({
        body: {
            email,
            password,
        },
    });

    return user;
};*/

export const createUser = async (name: string, email: string, password: string, role: "user" | "pending" | "admin" | "superadmin" = "pending") => {
    const user = await auth.api.createUser({
        headers: await headers(),
        body: {
            name,
            email,
            password,
            role,
        },
    });

    return user;
};

export const getSessions = async () => {
    const sessions = await auth.api.listSessions({
        headers: await headers(),
    });

    return sessions;
};

export const getSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session;
};

export const revokeSession = async (e: string) => {
    try {
        const { status } = await auth.api.revokeSession({
            body: {
                token: e,
            },
            headers: await headers(),
        });
        return status;
    } catch (e) {}
};

export const getAccounts = async () => {
    const sessions = await auth.api.listUserAccounts({
        headers: await headers(),
    });

    return sessions;
};

export const unlinkAccount = async (provider: string, account: string) => {
    try {
        const { status } = await auth.api.unlinkAccount({
            body: {
                providerId: provider,
                accountId: account,
            },
            headers: await headers(),
        });

        return status;
    } catch (e) {}
};

export const getOrganization = async (organizationSlug?: string) => {
    try {
        const organization = await auth.api.getFullOrganization({
            headers: await headers(),
            query: {
                organizationSlug,
            },
        });

        return organization;
    } catch (e) {}
};

export const listOrganizations = async () => {
    try {
        const organizations = await auth.api.listOrganizations({
            headers: await headers(),
        });

        return organizations;
    } catch (e) {}
};

export const getLastOrganizationOrFirst = async (userId: string) => {
    try {
        const organizations = await db.query.organizationMember.findMany({
            where: eq(drizzleOrganization.member.userId, userId),
        });

        if (organizations.length > 0) {
            return organizations[0].id;
        }

        return null;
    } catch (e) {
        return null;
    }
};
export const createOrganization = async (name: string, slug: string) => {
    try {
        const organization = await auth.api.createOrganization({
            headers: await headers(),
            body: {
                name,
                slug,
            },
        });

        return organization;
    } catch (e) {
        console.log("err", e);
    }
};

export const checkSlugOrganization = async (slug: string) => {
    try {
        const { status } = await auth.api.checkOrganizationSlug({
            headers: await headers(),
            body: {
                slug,
            },
        });

        return status;
    } catch (e) {
        console.log("err", e);
    }
};

export const getActiveMember = async () => {
    try {
        const member = await auth.api.getActiveMember({
            headers: await headers(),
        });

        return member;
    } catch (e) {
        console.log("err", e);
    }
};

export const setActiveOrganization = async (slug: string) => {
    try {
        const organization = await auth.api.setActiveOrganization({
            headers: await headers(),
            body: {
                organizationSlug: slug,
            },
        });
        return organization;
    } catch (e) {
        console.log("error", e);
    }
};
