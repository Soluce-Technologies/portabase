import {baseAuth} from "@/auth/auth";
import {Organization} from "@prisma/client";

export const currentOrganization = async () => {
    const session = await baseAuth();
    console.log("mysession", session)
    if (!session?.organization) {
        return null;
    }
    return session.organization as Organization;
}