"use client"

import {useEffect, useRef} from "react";
import {useSearchParams} from "next/navigation";

import {LoginForm} from "@/components/wrappers/auth/Login/LoginForm/LoginForm";
import {toast} from "sonner";

export default function SignInPage(props: {
    searchParams: Promise<{ callbackUrl: string | undefined }>
}) {

    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current && error) {
            toast.error("Error occurred.");
            isFirstRender.current = false;
        }
    }, [error]);

    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <LoginForm/>
        </div>
    )
}