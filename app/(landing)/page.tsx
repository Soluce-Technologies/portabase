import {redirect} from "next/navigation";
import {currentUser} from "@/auth/current-user";



export default async function Index() {
    const user = await currentUser()
    if (user) {
        redirect("/dashboard")
    }
    redirect("/login")
    //Do not delete
    // return (
    //     <Home/>
    // );
}
