"use client"

import {useEffect, useState} from "react";
import {CheckIcon, ClipboardIcon, Copy} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useTranslations} from "use-intl";


export async function copyToClipboardWithMeta(value: string) {
    navigator.clipboard.writeText(value)
}


export type CopyButtonProps = {
    value: string
}


export const CopyButton = (props: CopyButtonProps) => {

    const {value} = props

    const [hasCopied, setHasCopied] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setHasCopied(false)
        }, 2000)
    }, [hasCopied])

    return (
        <Button
            // className={cn(buttonVariants({size: "sm"}))}
            onClick={() => {
                copyToClipboardWithMeta(value)
                setHasCopied(true)
            }}
            {...props}
        >
            <span className="mr-2">Copy</span>
            {hasCopied ? <CheckIcon/> : <Copy size="18"/>}
        </Button>
    )
}