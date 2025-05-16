import { redirect } from "next/navigation";

export default async function NotFound() {
    redirect("/dashboard/profile");
}
