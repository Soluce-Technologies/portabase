"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export type VariantButton = {
    secondary: string;
    default: string;
    outline: string;
    ghost: string;
    link: string;
    destructive: string;
};

export type ButtonWithConfirmProps = {
    icon?: any;
    text: string;
    variant?: keyof VariantButton;
    className?: string;
    onClick?: () => void;
    isPending?: boolean;
};

export const ButtonWithConfirm = (props: ButtonWithConfirmProps) => {
    const [isConfirming, setIsConfirming] = useState(false);

    return (
        <Button
            onClick={() => {
                if (isConfirming && props.onClick) {
                    props.onClick();
                } else {
                    setIsConfirming(true);
                }
            }}
            variant={props.variant ? props.variant : "default"}
            className={props.className}
        >
            {props.isPending && <Loader2 className="animate-spin mr-4" size={16} />}
            {isConfirming ? "Are you sure ?" : `${props.text}`}
            <>{props.icon ? props.icon : null}</>
        </Button>
    );
};
