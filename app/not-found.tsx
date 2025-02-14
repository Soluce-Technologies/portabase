import {redirect, useRouter} from "next/navigation";

export default async function NotFound() {
    console.log("not found");
    redirect("/")
}