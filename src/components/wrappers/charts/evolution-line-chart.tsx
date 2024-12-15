"use client"

import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";
import {humanReadableDate} from "@/utils/date-formatting";

const data = [
    {date: "2024-12-01", count: 1},
    {date: "2024-12-02", count: 2},
    {date: "2024-12-03", count: 4},
    {date: "2024-12-04", count: 8},
    {date: "2024-12-05", count: 9},
    {date: "2024-12-06", count: 9},
    {date: "2024-12-07", count: 10},
    {date: "2024-12-08", count: 13},
    {date: "2024-12-09", count: 15},
    {date: "2024-12-10", count: 18},

]


type Data = {
    createdAt: Date;
}


export type evolutionLineChartProps = {
    data: Data[]
}

export function EvolutionLineChart(props: evolutionLineChartProps) {

    const {data} = props
    console.log("aaa data", data)


    // Process data to calculate cumulative count
    const cumulativeData = data.reduce((acc, backup) => {
        const date = backup.createdAt.toISOString().split("T")[0]; // Format as YYYY-MM-DD

        // Increment count for the current date or initialize it
        if (acc.length && acc[acc.length - 1].date === date) {
            acc[acc.length - 1].count += 1;
        } else {
            const lastCount = acc.length ? acc[acc.length - 1].count : 0;
            acc.push({date, count: lastCount + 1});
        }

        return acc;
    }, [] as { date: string; count: number }[]);


    const chartConfig = {
        date: {
            label: "Date",
            color: "#2563eb",
        },
        count: {
            label: "Number of backups",
            color: "#60a5fa",
        },
    } satisfies ChartConfig


    return (
        <ChartContainer config={chartConfig}>
            <LineChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false}/>
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => humanReadableDate(Date(value)).split(' ')[0]}
                />
                <YAxis/>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel/>}
                />
                <Line
                    dataKey="count"
                    type="linear"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ChartContainer>
    )
}