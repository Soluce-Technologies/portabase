"use client"

import {PropsWithChildren} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {signOutAction} from "@/features/auth/auth.action";
import {redirect} from "next/navigation";

export type LoggedInDropdownProps = PropsWithChildren<{}>

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
                    <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                    signOutAction()
                }}>
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

)
}
