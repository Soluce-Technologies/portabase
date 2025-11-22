import {PageParams} from "@/types/next";
import {Metadata} from "next";
import {ResetPasswordSection} from "@/components/wrappers/auth/reset-password/reset-password-section";

export const metadata: Metadata = {
    title: "Reset Password",
};

export default async function RoutePage(props: PageParams<{}>) {
    return (
        <div className="mx-auto grid w-full gap-6">
            <ResetPasswordSection/>
        </div>
    )
}