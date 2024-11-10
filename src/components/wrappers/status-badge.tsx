import React from "types-react";
import {Badge} from "@/components/ui/badge";

export type cardsWithPaginationProps = {
    status: "waiting" | "ongoing" | "failed" | "success";
}


export const StatusBadge = ({status}: cardsWithPaginationProps) => {

    switch (status) {
        case 'waiting':
            return <Badge variant="outline" className="text-yellow-500 border-2 border-yellow-500">waiting</Badge>
        case 'ongoing':
            return <Badge variant="outline" className="text-orange-500 border-2 border-orange-500">ongoing</Badge>
        case 'failed':
            return <Badge variant="outline" className="text-red-500 border-2 border-red-500">failed</Badge>
        case 'success':
            return <Badge variant="outline" className="text-green-500 border-2 border-green-500">success</Badge>
        default:
            throw Error
    }
}