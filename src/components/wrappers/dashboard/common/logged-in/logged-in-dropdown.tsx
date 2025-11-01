"use client";

import { PropsWithChildren } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { redirect } from "next/navigation";
import { CircleUser, LogOut, ShieldHalf } from "lucide-react";
import { signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { User } from "@/db/schema/02_user";

export type LoggedInDropdownProps = PropsWithChildren<{
    user: User;
}>;

export const LoggedInDropdown = (props: LoggedInDropdownProps) => {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="min-w-[var(--radix-popper-anchor-width)]">
                <DropdownMenuItem
                    onClick={() => {
                        redirect("/dashboard/profile");
                    }}
                >
                    <div className="flex justify-start items-center gap-2">
                        <CircleUser size={16} />
                        <span>Account</span>
                    </div>
                </DropdownMenuItem>
                {(props.user.role === "superadmin" || props.user.role === "admin") && (
                    <DropdownMenuItem
                        onClick={() => {
                            redirect("/dashboard/admin");
                        }}
                    >
                        <div className="flex justify-start items-center gap-2">
                            <ShieldHalf size={16} />
                            <span>Administration Panel</span>
                        </div>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    onClick={async () => {
                        await signOut({
                            fetchOptions: {
                                onSuccess: () => {
                                    router.push("/login");
                                },
                            },
                        });
                    }}
                >
                    <div className="flex justify-start items-center gap-2">
                        <LogOut size={16} />
                        <span>Log out</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
