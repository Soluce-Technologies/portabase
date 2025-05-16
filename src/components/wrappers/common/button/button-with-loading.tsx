"use client";

import { Button } from "@/components/ui/button";
import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export type VariantButton = {
    secondary: string;
    default: string;
    outline: string;
    ghost: string;
    link: string;
    destructive: string;
};
export type sizeButton = {
    default: string;
    icon: string;
    sm: string;
    lg: string;
};

export type ButtonWithConfirmProps = {
    icon?: any;
    text: string;
    variant?: keyof VariantButton;
    className?: string;
    onClick: () => void;
    isPending?: boolean;
    size: keyof sizeButton;
};

export const ButtonWithLoading = ({
    icon,
    text,
    variant,
    className,
    onClick,
    isPending,
    size,
    ...props // catch all remaining props
}: ButtonWithConfirmProps & ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <Button
            onClick={() => {
                onClick();
            }}
            variant={variant ? variant : "default"}
            className={className}
            {...props} // forward the remaining props to the Button component
            size={size || "default"}
        >
            {isPending && <Loader2 className="animate-spin mr-4" size={16} />}
            {text}
            <>{icon ? icon : null}</>
        </Button>
    );
};
