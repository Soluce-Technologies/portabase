"use client"

import {useEffect, useRef, useState} from "react";
import {useSearchParams} from "next/navigation";

import {LoginForm} from "@/components/wrappers/auth/login/login-form/login-form";
import {toast} from "sonner";

export default function SignInPage(props: {
    searchParams: Promise<{ callbackUrl: string | undefined }>
}) {

    const [urlParams, setUrlParams] = useState<URLSearchParams>();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setUrlParams(urlParams);
        const error = urlParams.get("error");
        console.log(urlParams.get("redirect"));
        if (error?.includes("pending")) {
            toast.error("Your account is not active.");
            urlParams.delete("error");
            window.history.replaceState({}, document.title, window.location.pathname + "?" + urlParams.toString());
        }
    }, []);

    return (
        <div className="mx-auto grid w-full gap-6">
            <LoginForm/>
        </div>
    )
}