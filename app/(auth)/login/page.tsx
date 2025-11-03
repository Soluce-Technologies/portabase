import {notFound} from "next/navigation";
import {env} from "@/env.mjs";
import {LoginForm} from "@/components/wrappers/auth/login/login-form/login-form";

export default async function SignInPage() {

    const authGoogleEnabled = env.AUTH_GOOGLE_METHOD;
    if (!authGoogleEnabled) {
        notFound()
    }

    return (
        <div className="mx-auto grid w-full gap-6">
            <LoginForm authGoogleEnabled={authGoogleEnabled}/>
        </div>
    )
}