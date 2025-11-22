import {PageParams} from "@/types/next";
import {Metadata} from "next";
import {ForgotPasswordForm} from "@/components/wrappers/auth/forgot-password/forgot-password-form";

export const metadata: Metadata = {
    title: "Forgot Password",
};

export default async function RoutePage(props: PageParams<{}>) {
    return (
        <div className="mx-auto grid w-full gap-6">
            <ForgotPasswordForm/>
        </div>
    )
}