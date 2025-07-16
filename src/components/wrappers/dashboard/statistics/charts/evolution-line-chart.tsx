"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { humanReadableDate } from "@/utils/date-formatting";

type Data = {
    createdAt: Date;
};

export type evolutionLineChartProps = {
    data: Data[];
};

export function EvolutionLineChart(props: evolutionLineChartProps) {
    const { data } = props;

    // Process data to calculate cumulative count
    const cumulativeData = data.reduce(
        (acc, backup) => {
            const date = backup.createdAt.toISOString().split("T")[0]; // Format as YYYY-MM-DD

            // Increment count for the current date or initialize it
            if (acc.length && acc[acc.length - 1].date === date) {
                acc[acc.length - 1].count += 1;
            } else {
                const lastCount = acc.length ? acc[acc.length - 1].count : 0;
                acc.push({ date, count: lastCount + 1 });
            }

            return acc;
        },
        [] as { date: string; count: number }[]
    );

    console.log(cumulativeData);

    const chartConfig = {
        date: {
            label: "Date",
            color: "#2563eb",
        },
        count: {
            label: "Number of backups",
            color: "#60a5fa",
        },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={chartConfig}>
            <LineChart
                accessibilityLayer
                data={cumulativeData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                        return humanReadableDate(new Date(value)).split(" ")[0]
                    }}
                />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Line dataKey="count" type="linear" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
            </LineChart>
        </ChartContainer>
    );
}
