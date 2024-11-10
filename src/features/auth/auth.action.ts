"use server"

import {redirect} from "next/navigation";
import {signIn, signOut} from "@/auth/auth";

export const signOutAction = async () => {
    await signOut({redirectTo: '/', redirect: true})
    window.location.reload();
}
export const signInAction = async (type: string, formData?: any) => {
    if (type === "google") {
        await signIn(type, {redirectTo: '/dashboard'})
    } else {
        try {
            await signIn(type, {
                redirect: false,
                password: formData.password,
                email: formData.email
            });
        } catch (error) {
            // const signInError = error as CredentialsSignin
            console.error(error);
            return {error: "Error loging in, please try again or check your credentials !"};
        }
        redirect("/")
    }
}
