"use client"

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {formatDateLastContact} from "@/utils/date-formatting";
import {Database} from "@prisma/client";

export type DatabaseKpiPro = {
    successRate: any,
    database: Database,
    totalBackups: number
}


export const DatabaseKpi = (props: DatabaseKpiPro) => {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between gap-8 mb-6">
            <Card className="w-full sm:w-auto flex-1">
                <CardHeader className="font-bold text-xl">
                    Backups
                </CardHeader>
                <CardContent>{props.totalBackups}</CardContent>
            </Card>
            <Card className="w-full sm:w-auto flex-1">
                <CardHeader className="font-bold text-xl">
                    Success rate
                </CardHeader>
                <CardContent>
                    {props.successRate ?? "Unavailable for now."}
                </CardContent>
            </Card>
            <Card className="w-full sm:w-auto flex-1">
                <CardHeader className="font-bold text-xl">
                    Last contact
                </CardHeader>
                <CardContent>
                    {formatDateLastContact(props.database.lastContact)}
                </CardContent>
            </Card>
        </div>
    )
}