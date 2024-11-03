import Home from "./home/page";
import {redirect} from "next/navigation";
import {currentUser} from "@/auth/current-user";



export default async function Index() {

    const user = await currentUser()
    console.log(user)
    if (user) {
        redirect("/dashboard")
    }
    redirect("/login")

    // return (
    //     <Home/>
    // );
}
