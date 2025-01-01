"use server"

import {redirect} from "next/navigation";
import {signIn, signOut} from "@/auth/auth";
import {getServerUrl} from "@/utils/get-server-url";
import {deleteOrganizationCookie, setCurrentOrganizationSlug} from "@/features/dashboard/organization-cookie";
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
    const deleteCookieResponse = await setCurrentOrganizationSlug("");
    await signOut({ redirectTo: '/', redirect: true });

    if (typeof window !== 'undefined') {
        window.location.reload();
    }

    return deleteCookieResponse;
};
//
// export const signOutAction = async () => {
//     // await manualSignOut()
//     await signOut({redirectTo: '/', redirect: true})
//     await deleteOrganizationCookie()
//     window.location.reload();
// }
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
