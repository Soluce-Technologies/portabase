"use server"

import {redirect} from "next/navigation";
import {signIn, signOut} from "@/auth/auth";
import {getServerUrl} from "@/utils/get-server-url";
//
// const baseUrl = getServerUrl();
// async function fetchCsrfToken() {
//     const response = await fetch(`${baseUrl}/api/auth/csrf`);
//     const data = await response.json();
//     return data.csrfToken;
// }
//
// async function manualSignOut() {
//     const csrfToken = await fetchCsrfToken();
//
//     const formData = new URLSearchParams();
//     formData.append('csrfToken', csrfToken);
//     formData.append('json', 'true');
//
//     const response = await fetch(`${baseUrl}/api/auth/signout`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: formData.toString(),
//     });
//
//     if (response.ok) {
//         console.log('Signed out successfully');
//         window.location.reload();
//
//     } else {
//         console.error('Failed to sign out');
//     }
// }
//


export const signOutAction = async () => {
    // await manualSignOut()
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
            return {error: "Error loging in, please try again or check your credentials !"};
        }
        redirect("/")
    }
}
