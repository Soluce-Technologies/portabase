import {PageParams} from "@/types/next";
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {LayoutAdmin} from "@/components/layout";
import {RegisterForm} from "@/components/wrappers/Auth/Register/RegisterForm/RegisterForm";


export default async function RoutePage(props: PageParams<{}>) {

    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <RegisterForm/>
        </div>

    )
}