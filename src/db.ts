import {currentUser} from "@/auth/current-user";
import {enhance} from "@zenstackhq/runtime";
import {prisma} from "@/prisma";

const user = await currentUser();
console.log("bbbbbbb", user)

export const db = enhance(prisma, {user: user});
console.log("cccccccccc", db)
