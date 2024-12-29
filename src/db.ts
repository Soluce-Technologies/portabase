import {currentUser} from "@/auth/current-user";
import {enhance} from "@zenstackhq/runtime";
import {prisma} from "@/prisma";

const user = await currentUser();

export const db = enhance(prisma, {user: user});
