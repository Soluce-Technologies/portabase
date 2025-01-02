// import {currentUser} from "@/auth/current-user";
// import {enhance} from "@zenstackhq/runtime";
// import {prisma} from "@/prisma";
//
// const user = await currentUser();
//
// export const db = enhance(prisma, {user: user});

import { enhance } from "@zenstackhq/runtime";
import { prisma } from "@/prisma";

export const getDb = async () => {
    const { currentUser } = await import("@/auth/current-user");
    const user = await currentUser();
    return enhance(prisma, { user });
};