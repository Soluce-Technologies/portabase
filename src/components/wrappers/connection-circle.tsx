import {cn} from "@/lib/utils";

export type connectionCircleProps = {
    date: Date
}


export const ConnectionCircle = ({date}: connectionCircleProps) => {

    let style = "";

    const interval = new Date().getTime() - new Date(date).getTime()

    if (interval < 10000) {
        style = "bg-green-400 border-green-600"
    } else if (1000 <= interval && interval <= 20000) {
        style = "bg-orange-400 border-orange-600"
    } else {
        style = "bg-red-400 border-red-600"
    }

    return (
        <div color="red" className={cn("w-5 h-5 rounded-3xl border-4", style)}/>
    )
}