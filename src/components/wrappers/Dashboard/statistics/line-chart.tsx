// "use client"
//
// import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts"
// import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
// import {humanReadableDate} from "@/utils/date-formatting";
//
//
// export type lineChartProps = {
//     data: any
// }
//
// export function EvolutionLineChart(props: lineChartProps) {
//
//     const {data} = props
//
//     // Process data to calculate cumulative count
//     const cumulativeData = data.reduce((acc, backup) => {
//         const date = backup.createdAt.toISOString().split("T")[0]; // Format as YYYY-MM-DD
//
//         // Increment count for the current date or initialize it
//         if (acc.length && acc[acc.length - 1].date === date) {
//             acc[acc.length - 1].count += 1;
//         } else {
//             const lastCount = acc.length ? acc[acc.length - 1].count : 0;
//             acc.push({date, count: lastCount + 1});
//         }
//
//         return acc;
//     }, [] as { date: string; count: number }[]);
//
//
//     const chartConfig = {
//         date: {
//             label: "Date",
//             color: "#2563eb",
//         },
//         count: {
//             label: "Number of backups",
//             color: "#60a5fa",
//         },
//     } satisfies ChartConfig
//
//
//     return (
//         <ChartContainer config={chartConfig}>
//             <LineChart
//                 accessibilityLayer
//                 data={data}
//                 margin={{
//                     left: 12,
//                     right: 12,
//                 }}
//             >
//                 <CartesianGrid vertical={false}/>
//                 <XAxis
//                     dataKey="date"
//                     tickLine={false}
//                     axisLine={false}
//                     tickMargin={8}
//                     tickFormatter={(value) => humanReadableDate(Date(value)).split(' ')[0]}
//                 />
//                 <YAxis/>
//                 <ChartTooltip
//                     cursor={false}
//                     content={<ChartTooltipContent hideLabel/>}
//                 />
//                 <Line
//                     dataKey="count"
//                     type="linear"
//                     stroke="var(--color-desktop)"
//                     strokeWidth={2}
//                     dot={false}
//                 />
//             </LineChart>
//         </ChartContainer>
//     )
// }
//
// export function PercentageLineChart(props: lineChartProps) {
//
//     const {data} = props
//
//     const chartConfig = {
//         date: {
//             label: "Date",
//             color: "#2563eb",
//         },
//         successRate: {
//             label: "Success Rate",
//             color: "#60a5fa",
//         },
//     } satisfies ChartConfig
//
//     const dailyStats = data.reduce((acc, backup) => {
//         const date = backup.createdAt.toISOString().split("T")[0]; // Format YYYY-MM-DD
//         const status = backup.status;
//
//         if (!acc[date]) {
//             acc[date] = {success: 0, failed: 0, total: 0};
//         }
//
//         acc[date][status === "success" ? "success" : "failed"] += backup._count.id;
//         acc[date].total += backup._count.id;
//
//         return acc;
//     }, {} as Record<string, { success: number; failed: number; total: number }>);
//
//     // Format data for the chart
//     const formattedData = Object.entries(dailyStats).map(([date, stats]) => ({
//         date,
//         successRate: (stats.success / stats.total) * 100,
//     }));
//
//     return (
//         <ChartContainer config={chartConfig}>
//             <LineChart data={formattedData}>
//                 <CartesianGrid strokeDasharray="3 3"/>
//                 <XAxis dataKey="date"/>
//                 <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`}/>
//                 {/*<Tooltip formatter={(value: number) => `${value.toFixed(2)}%`}/>*/}
//                 <ChartTooltip
//                     content={<ChartTooltipContent/>}
//                     cursor={false}
//                     defaultIndex={1}
//                     formatter={(value, name) => (
//                         <div className="flex min-w-[130px] items-center text-xs text-muted-foreground">
//                             {chartConfig[name as keyof typeof chartConfig]?.label ||
//                                 name}
//                             <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
//                                 {value}
//                                 <span className="font-normal text-muted-foreground">
//                           %
//                         </span>
//                             </div>
//                         </div>
//                     )}
//                 />
//                 <Line type="step" dataKey="successRate" stroke="#8884d8" strokeWidth={2}/>
//             </LineChart>
//         </ChartContainer>
//     )
//
// }
//
