import React from "react";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/auth/current-user";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await currentUser();

    if (user!.role !== "superadmin" && user!.role !== "admin") {
        notFound();
    }

    return <>{children}</>;
}
