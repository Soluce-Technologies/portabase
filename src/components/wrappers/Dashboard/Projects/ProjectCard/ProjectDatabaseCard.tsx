"use client";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image"
import {ConnectionCircle} from "@/components/wrappers/connection-circle";
import {formatDateLastContact} from "@/utils/date-formatting";

export type projectDatabaseCardProps = {
    data: any,
    extendedProps: any
}

export const ProjectDatabaseCard = (props: projectDatabaseCardProps) => {
    const {data: database, extendedProps: extendedProps} = props;
    return (
        <Link href={`/dashboard/projects/${extendedProps.id}/database/${database.id}`}>
            <Card className="flex flex-row justify-between">
                <div className="flex flex-row items-center gap-2">
                    <Image
                        src="/PostgreSQL.png"
                        alt="Database type Icon"
                        width={60}
                        height={60}
                        className="object-cover ml-4"
                    />
                    <div >
                        <CardHeader>Name : {database.name}</CardHeader>
                        <CardContent>
                            Last contact: {formatDateLastContact(database.lastContact)}
                        </CardContent>
                    </div>
                </div>
                <div className="mt-3 mr-3">
                    <ConnectionCircle date={database.lastContact}/>
                </div>
            </Card>
        </Link>
    )
}