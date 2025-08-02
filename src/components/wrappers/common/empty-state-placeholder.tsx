import Link from "next/link";
import {cn} from "@/lib/utils";
import {Plus} from "lucide-react";

type EmptyStatePlaceholderProps = {
    url: string;
    text: string;
}


export const EmptyStatePlaceholder = ({url, text}: EmptyStatePlaceholderProps) => {
    return (
        <Link
            href={url}
            className={cn(
                "flex flex-col items-center justify-center w-full rounded-2xl border border-dashed border-muted p-6 lg:p-10",
                "hover:bg-muted/50 transition-colors text-muted-foreground hover:text-primary text-center space-y-2"
            )}
        >
            <Plus className="w-5 h-5 lg:w-6 lg:h-6"/>
            <span className="text-sm lg:text-base font-medium">{text}</span>
        </Link>
    )
}