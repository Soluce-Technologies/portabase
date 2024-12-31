"use client"

import {PropsWithChildren} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {signOutAction} from "@/features/auth/auth.action";
import {redirect} from "next/navigation";
import {CircleUser, LogOut, ShieldHalf} from "lucide-react";
import {User} from "@prisma/client";

export type LoggedInDropdownProps = PropsWithChildren<{
    user: User
}>

export const LoggedInDropdown = (props: LoggedInDropdownProps) => {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {props.children}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
            >
                <DropdownMenuItem onClick={() => {
                    redirect("/dashboard/profile")
                }}>
                    <div className="flex justify-start items-center gap-2">
                        <CircleUser size={16}/>
                        <span>Account</span>
                    </div>
                </DropdownMenuItem>
                {props.user.role == "admin" ?
                    <DropdownMenuItem onClick={() => {
                        redirect("/dashboard/admin")
                    }}>
                        <div className="flex justify-start items-center gap-2">
                            <ShieldHalf size={16}/>
                            <span>Administration Panel</span>
                        </div>
                    </DropdownMenuItem>
                    : null}
                <DropdownMenuItem onClick={() => {
                    signOutAction()
                }}>
                    <div className="flex justify-start items-center gap-2">
                        <LogOut size={16}/>
                        <span>Log out</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}