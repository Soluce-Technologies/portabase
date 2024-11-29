import {baseAuth} from "@/auth/auth";
import {User} from "@prisma/client";

export const currentUser = async () => {
    const session = await baseAuth();
    console.log("mysession", session)
    if (!session?.user) {
        return null;
    }
    return session.user as User;
}


export const requiredCurrentUser = async () => {
    const user = await currentUser();
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}
