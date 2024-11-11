import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

export type statusBadgeProps = {
    status: "pending" | "processing" | "success" | "failed"
}


export const StatusBadge = ({status}: statusBadgeProps) => {

    let style = "";

    switch (status) {
        case 'pending':
            style = "text-yellow-500 border-yellow-500"
            break
        case 'processing':
            style = "text-orange-500 border-orange-500"
            break
        case 'failed':
            style = "text-red-500 border-red-500"
            break
        case 'success':
            style = "text-green-500 border-green-500"
            break
        default:
            throw Error
    }

    return (
        <Badge variant="outline" className={cn("w-20 border-2 justify-center")}>{status}</Badge>
    )
}