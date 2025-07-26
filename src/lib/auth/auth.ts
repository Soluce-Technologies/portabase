import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import * as drizzleDb from "@/db";
import {db} from "@/db";
import {env} from "@/env.mjs";
import {nextCookies} from "better-auth/next-js";
import {admin as adminPlugin, openAPI, organization} from "better-auth/plugins";
import {ac, admin, orgAdmin, orgMember, orgOwner, pending, superadmin, user} from "@/lib/auth/permissions";
import {headers} from "next/headers";
import {count, eq} from "drizzle-orm";
import {OrganizationWithMembers, OrganizationWithMembersAndUsers} from "@/db/schema/02_organization";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: drizzleDb.schemas,
    }),
    secret: env.PROJECT_SECRET,
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
                owner: orgOwner,
                admin: orgAdmin,
                member: orgMember,
            },
        }),
        adminPlugin({
            adminRoles: ["admin", "superadmin"],
            defaultRole: "pending",
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
    databaseHooks: {
        user: {
            create: {
                async before(user, context) {
                    const userCount = (await db.select({count: count()}).from(drizzleDb.schemas.user))[0].count;
                    const role = userCount === 0 ? "superadmin" : "pending";

                    return {
                        data: {
                            ...user,
                            role,
                        },
                    };
                },
                async after(user, context) {
                    const userCount = (await db.select({count: count()}).from(drizzleDb.schemas.user))[0].count;

                    if (userCount === 1) {
                        const defaultOrgSlug = "default"; // change this if your default org has a different slug
                        const defaultOrg = await db.query.organization.findFirst({
                            where: eq(drizzleDb.schemas.organization.slug, defaultOrgSlug),
                        });

                        if (defaultOrg) {
                            await db.insert(drizzleDb.schemas.member).values({
                                userId: user.id,
                                organizationId: defaultOrg.id,
                                role: "orgOwner",
                            });
                        } else {
                            console.warn("Default organization not found. Cannot assign member.");
                        }
                    }
                },
            },
        },
        session: {
            create: {
                before: async (session, context) => {
                    const userId = session.userId;

                    const memberships = await db.query.member.findMany({
                        where: eq(drizzleDb.schemas.member.userId, userId),
                    });

                    if (!memberships.length) {
                        // Fail the login attempt explicitly
                        throw new Error("User is not part of any organization.");
                    }

                    const firstOrgId = memberships[0].organizationId;

                    return {
                        data: {
                            activeOrganizationId: firstOrgId,
                        },
                    };
                },
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
    trustedOrigins: [env.NEXT_PUBLIC_PROJECT_URL!, "http://app"],
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
    return await auth.api.createUser({
        headers: await headers(),
        body: {
            name,
            email,
            password,
            role,
        },
    });
};

export const getSessions = async () => {
    return await auth.api.listSessions({
        headers: await headers(),
    });
};

export const getSession = async () => {
    return await auth.api.getSession({
        headers: await headers(),
    });
};

export const revokeSession = async (e: string) => {
    try {
        const {status} = await auth.api.revokeSession({
            body: {
                token: e,
            },
            headers: await headers(),
        });
        return status;
    } catch (e) {
    }
};

export const getAccounts = async () => {
    return await auth.api.listUserAccounts({
        headers: await headers(),
    });
};

export const unlinkAccount = async (provider: string, account: string) => {
    try {
        const {status} = await auth.api.unlinkAccount({
            body: {
                providerId: provider,
                accountId: account,
            },
            headers: await headers(),
        });

        return status;
    } catch (e) {
    }
};
//
// export const getOrganization = async ({
//                                           organizationId,
//                                           organizationSlug,
//                                       }: {
//     organizationId?: string;
//     organizationSlug?: string;
// }) => {
//     const query = organizationId
//         ? {organizationId}
//         : {organizationSlug};
//
//     console.log(query);
//
//     try {
//         return await auth.api.getFullOrganization({
//             headers: await headers(),
//             // query,
//         });
//     } catch (e) {
//         console.error(e);
//         return null;
//     }
// };
// export const getOrganization = async ({
//                                           organizationId,
//                                           organizationSlug,
//                                       }: {
//     organizationId?: string;
//     organizationSlug?: string;
// } = {}) => {
//     const query =
//         organizationId != null
//             ? {organizationId}
//             : organizationSlug != null
//                 ? {organizationSlug}
//                 : undefined;
//
//     console.log(query);
//
//     try {
//         return await auth.api.getFullOrganization({
//             headers: await headers(),
//             ...(query ? {query} : {}),
//         });
//     } catch (e) {
//         console.error(e);
//         return null;
//     }
// };
export const getOrganization = async ({
                                          organizationId,
                                          organizationSlug,
                                      }: {
    organizationId?: string;
    organizationSlug?: string;
} = {}): Promise<OrganizationWithMembersAndUsers | null> => {
    const query =
        organizationId != null
            ? { organizationId }
            : organizationSlug != null
                ? { organizationSlug }
                : undefined;

    try {
        const response = await auth.api.getFullOrganization({
            headers: await headers(),
            ...(query ? { query } : {}),
        });

        return response as OrganizationWithMembersAndUsers;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const listOrganizations = async () => {
    try {
        return await auth.api.listOrganizations({
            headers: await headers(),
        });
    } catch (e) {
    }
};

export const getLastOrganizationOrFirst = async (userId: string) => {
    try {
        const organizations = await db.query.organization.findMany({
            where: eq(drizzleDb.schemas.member.userId, userId),
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
        return await auth.api.createOrganization({
            headers:  await headers(),
            body: {
                name,
                slug,
            },
        });
    } catch (e: any) {
        const errorMessage = e?.response?.data?.message || e?.message || "Unknown auth error";
        const status = e?.response?.status || 500;

        console.error("Auth API createOrganization error:", {
            message: errorMessage,
            status,
            raw: e,
        });

        throw {
            name: "AuthCreateOrganizationError",
            message: errorMessage,
            status,
            cause: e,
        };
    }
};

export const deleteOrganization = async (organizationId: string) => {
    try {
        return await auth.api.deleteOrganization({
            body: {
                organizationId,
            },
            headers: await headers(),
        });
    } catch (e: any) {
        const errorMessage = e?.response?.data?.message || e?.message || "Unknown auth error";
        const status = e?.response?.status || 500;

        console.error("Auth API deleteOrganization error:", {
            message: errorMessage,
            status,
            raw: e,
        });

        throw {
            name: "AuthDeleteOrganizationError",
            message: errorMessage,
            status,
            cause: e,
        };
    }
};


export const checkSlugOrganization = async (slug: string) => {
    try {
        const {status} = await auth.api.checkOrganizationSlug({
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
        console.log(member);

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
