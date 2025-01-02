"use client"
import {signInAction} from "@/features/auth/auth.action";
import {Button} from "@/components/ui/button";
import Image from "next/image";

export type SocialAuthButtonProps = {}

export const SocialAuthButton = (props: SocialAuthButtonProps) => {
    return (
        <div className="flex flex-col gap-4 mt-5">
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        void signInAction("google")
                    }}
                >
                    <Image src="/google-icon.png" alt="Google OAuth" width={25} height={25}/>
                    Sign in with google
                </Button>
        </div>
    )
}