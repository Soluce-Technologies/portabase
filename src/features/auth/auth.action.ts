"use server"

import {redirect} from "next/navigation";
import {signIn, signOut} from "@/auth/auth";
import {setCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";

export const signOutAction = async () => {
    const deleteCookieResponse = await setCurrentOrganizationSlug("");
    await signOut({ redirectTo: '/', redirect: true });

    // if (typeof window !== 'undefined') {
    //     window.location.reload();
    // }

    return deleteCookieResponse;
};

export const signInAction = async (type: string, formData?: any) => {
    if (type === "google") {
        await setCurrentOrganizationSlug("default");
        await signIn(type, {redirectTo: '/dashboard'})
    } else {
        try {
            await setCurrentOrganizationSlug("default");

            await signIn(type, {
                redirect: false,
                password: formData.password,
                email: formData.email
            });
        } catch (error) {
            return {error: "Error loging in, please try again or check your credentials !"};
        }
        redirect("/")
    }
}
