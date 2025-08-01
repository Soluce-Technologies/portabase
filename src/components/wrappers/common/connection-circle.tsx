import { cn } from "@/lib/utils";

export type ConnectionCircleProps = {
    date?: Date | null;
};

export const ConnectionCircle = ({ date }: ConnectionCircleProps) => {
    let style = "bg-gray-300 border-gray-400";

    if (date instanceof Date && !isNaN(date.getTime())) {
        const now = Date.now();
        const timestamp = date.getTime();
        const interval = now - timestamp;

        console.log({ now, timestamp, interval });

        if (interval < 10000) {
            style = "bg-green-400 border-green-600";
        } else if (interval <= 20000) {
            style = "bg-orange-400 border-orange-600";
        } else {
            style = "bg-red-400 border-red-600";
        }
    } else {
        console.warn("Invalid date passed to ConnectionCircle:", date);
    }

    console.log(style);

    return <div className={cn("w-5 h-5 rounded-full border-4", style)} />;
};
