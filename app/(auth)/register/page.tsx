"use client"

import {PageParams} from "@/types/next";
import {RegisterForm} from "@/components/wrappers/auth/Register/register-form/RegisterForm";

export default function RoutePage(props: PageParams<{}>) {
    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <RegisterForm/>
        </div>
    )
}