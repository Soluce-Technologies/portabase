import Home from "./home/page";
import {redirect} from "next/navigation";

export default async function Index() {

    const user = true
    if (user) {
        redirect("/dashboard")
    }

    return (
        <Home/>
    );
}
