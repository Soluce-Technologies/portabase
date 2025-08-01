import {PageParams} from "@/types/next";
import {RegisterForm} from "@/components/wrappers/auth/register/register-form/register-form";

export default async function RoutePage(props: PageParams<{}>) {
    return (
        <div className="mx-auto grid w-full gap-6">
            <RegisterForm/>
        </div>
    )
}