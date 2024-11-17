"use client"
import {Button} from "@/components/ui/button";
import {ButtonHTMLAttributes, useState} from "react";
import {Loader2} from "lucide-react";

export type VariantButton = {
    secondary: string
    default: string
    outline: string
    ghost: string
    link: string
    destructive: string
}

export type ButtonWithConfirmProps = {
    icon?: any,
    text: string,
    variant?:  keyof VariantButton ,
    className?: string,
    onClick: () => void,
    isPending? : boolean
};

export const ButtonWithLoading = ({
                                      icon,
                                      text,
                                      variant,
                                      className,
                                      onClick,
                                      isPending,
                                      ...props // catch all remaining props
                                  }: ButtonWithConfirmProps & ButtonHTMLAttributes<HTMLButtonElement>) => {
    return(
        <Button
            onClick={() => {
                onClick()
            }}
            variant={variant ? variant : "default"}
            className={className}
            {...props} // forward the remaining props to the Button component
        >
            {isPending && <Loader2 className="animate-spin mr-4" size={16}/>}
            {text}
            <>
                {icon ? icon : null}
            </>
        </Button>
    )
}