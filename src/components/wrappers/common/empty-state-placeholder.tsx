// import Link from "next/link";
// import {cn} from "@/lib/utils";
// import {Plus} from "lucide-react";
//
// type EmptyStatePlaceholderProps = {
//     url?: string;
//     text: string;
//     className?: string;
// }
//
// export const EmptyStatePlaceholder = ({url, text, className}: EmptyStatePlaceholderProps) => {
//     return (
//         <div className={cn("",className)}>{url ?
//             <Link
//                 href={url}
//                 className={cn(
//                     "h-full",
//                     "flex flex-col items-center justify-center w-full rounded-2xl border border-dashed border-muted p-6 lg:p-10",
//                     "hover:bg-muted/50 transition-colors text-muted-foreground hover:text-primary text-center space-y-2"
//                 )}
//             >
//                 <Plus className="w-5 h-5 lg:w-6 lg:h-6"/>
//                 <span className="text-sm lg:text-base font-medium">{text}</span>
//             </Link>
//             :
//             <div className="flex h-full flex-col items-center justify-center py-12 text-center">
//                 <p className="text-lg text-muted-foreground">{text}</p>
//             </div>
//         }
//         </div>
//
//     )
// }
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Plus} from "lucide-react";

type EmptyStatePlaceholderProps = {
    url?: string;
    onClick?: () => void;
    text: string;
    className?: string;
};

export const EmptyStatePlaceholder = ({
                                          url,
                                          onClick,
                                          text,
                                          className,
                                      }: EmptyStatePlaceholderProps) => {
    const content = (
        <div
            className={cn(
                "flex h-full flex-col items-center justify-center w-full rounded-2xl border border-dashed border-muted p-6 lg:p-10",
                "hover:bg-muted/50 transition-colors text-muted-foreground hover:text-primary text-center space-y-4 cursor-pointer",
                onClick || url ? "cursor-pointer" : "cursor-default"
            )}
            {...(onClick ? {onClick} : url ? {asChild: true} : {})}
        >
            <Plus className="w-5 h-5 lg:w-6 lg:h-6"/>
            <div>
                <p className="text-sm ">{text}</p>
            </div>
        </div>
    );

    return (
        <div className={cn("", className)}>
            {url ? <Link href={url}>{content}</Link> : content}
        </div>
    );
};