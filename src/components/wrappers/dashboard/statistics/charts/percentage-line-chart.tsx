"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { EStatusSchema } from "@/db/schema/types";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type Data = {
    createdAt: Date;
    status: EStatusSchema;
    _count: number;
};

export type percentageLineChartProps = {
    data: Data[];
};

export function PercentageLineChart(props: percentageLineChartProps) {
    const { data } = props;

    const chartConfig = {
        date: {
            label: "Date",
            color: "#2563eb",
        },
        successRate: {
            label: "Success Rate",
            color: "#60a5fa",
        },
    } satisfies ChartConfig;

    const dailyStats = data.reduce(
        (acc, backup) => {
            const date = backup.createdAt.toISOString().split("T")[0]; // Format YYYY-MM-DD
            const status = backup.status;

            if (!acc[date]) {
                acc[date] = { success: 0, failed: 0, total: 0 };
            }

            acc[date][status === "success" ? "success" : "failed"] += backup._count;
            acc[date].total += backup._count;

            return acc;
        },
        {} as Record<string, { success: number; failed: number; total: number }>
    );

    // Format data for the chart
    const formattedData = Object.entries(dailyStats).map(([date, stats]) => ({
        date,
        successRate: (stats.success / stats.total) * 100,
    }));

    return (
        <ChartContainer config={chartConfig}>
            <LineChart accessibilityLayer data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                    defaultIndex={1}
                    formatter={(value, name) => (
                        <div className="flex min-w-[130px] items-center text-xs text-muted-foreground">
                            {chartConfig[name as keyof typeof chartConfig]?.label || name}
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                {value}
                                <span className="font-normal text-muted-foreground">%</span>
                            </div>
                        </div>
                    )}
                />
                <Line type="step" dataKey="successRate" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
        </ChartContainer>
    );
}
