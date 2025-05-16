import { cn } from "@/lib/utils";

export type ConnectionCircleProps = {
    date?: Date | null;
};

export const ConnectionCircle = ({ date }: ConnectionCircleProps) => {
    let style = "bg-gray-300 border-gray-400";

    if (date) {
        const now = Date.now();
        const timestamp = new Date(date).getTime();
        const interval = now - timestamp;

        if (interval < 10000) {
            style = "bg-green-400 border-green-600";
        } else if (interval <= 20000) {
            style = "bg-orange-400 border-orange-600";
        } else {
            style = "bg-red-400 border-red-600";
        }
    }

    return <div className={cn("w-5 h-5 rounded-full border-4", style)} />;
};
