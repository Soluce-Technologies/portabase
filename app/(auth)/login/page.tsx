"use client"
import {useSearchParams} from "next/navigation";
import {LoginForm} from "@/components/wrappers/Auth/Login/LoginForm/LoginForm";
import {useEffect, useRef} from "react";
import {toast} from "sonner";

export default function SignInPage(props: {
    searchParams: { callbackUrl: string | undefined }
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