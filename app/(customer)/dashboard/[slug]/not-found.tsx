import {redirect, useRouter} from "next/navigation";
import {useEffect} from "react";
import {currentUser} from "@/auth/current-user";

// export default function NotFound() {
//
//     const router = useRouter();
//
//     useEffect(() => {
//         router.push('/');
//     }, [router]);
//
//     return null; // You can return null or a loading spinner while the redirect happens
// }

export default async function NotFound() {

    // const user = await currentUser()
    // if (!user) {
    //     redirect("/")
    // }else{
    //     redirect("/")
    // }

    redirect("/dashboard/default")
}