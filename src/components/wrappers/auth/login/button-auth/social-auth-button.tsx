"use client";
import {Button} from "@/components/ui/button";
import {signIn} from "@/lib/auth/auth-client";
import {JSX} from "react";

export type AuthButtonProps = {
    providers: SocialProviderType[];
    callBackURL?: string;
};

export type SocialProviderType = {
    id:
        | "github"
        | "apple"
        | "discord"
        | "facebook"
        | "microsoft"
        | "google"
        | "spotify"
        | "twitch"
        | "twitter"
        | "dropbox"
        | "kick"
        | "linkedin"
        | "gitlab"
        | "tiktok"
        | "reddit"
        | "roblox"
        | "vk";
    name: string;
    icon: JSX.Element;
};

export const SocialAuthButton = (props: AuthButtonProps): JSX.Element => {
    return (
        <div className="flex flex-col gap-4 mt-5">
            {props.providers.map((provider) => (
                <Button
                    key={provider.id}
                    aria-label={`Sign in with ${provider.name}`}
                    onClick={(e) => {
                        e.preventDefault();
                        void signIn.social({
                            provider: provider.id,
                            callbackURL: props.callBackURL ?? "/dashboard/profile",
                        });
                    }}
                >
                    {provider.icon}
                    Sign in with {provider.name}
                </Button>
            ))}
        </div>
    );
};
