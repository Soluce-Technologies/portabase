"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConnectionCircle } from "@/components/wrappers/common/connection-circle";
import { formatDateLastContact } from "@/utils/date-formatting";
import {Database} from "@/db/schema/07_database";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export type projectDatabaseCardProps = {
    data: Database;
    extendedProps: any;
    organizationSlug: string;
};

export const ProjectDatabaseCard = (props: projectDatabaseCardProps) => {
    const { organizationSlug, data: database, extendedProps: extendedProps } = props;

    return (
        <Link className="block transition-all duration-200 hover:scale-[1.01] hover:shadow-md rounded-xl" href={`/dashboard/projects/${extendedProps.id}/database/${database.id}`}>
            <DatabaseCard data={database} />
        </Link>
    );
};

export type databaseCardProps = {
    data: Database;
};

export const DatabaseCard = (props: databaseCardProps) => {
    const { data: database } = props;

    return (

        <Card className="flex flex-row justify-between">
            <div className="flex items-center space-x-4 px-4">
                <Image src="/images/postgresql.png" alt="Database type Icon" width={60} height={60} className="object-cover ml-4" />

                <div className="justify-between">
                    <div className="font-medium">Name: {database.name}</div>
                    <div className="text-sm text-muted-foreground">Generated Id: {database.agentDatabaseId}</div>
                    <div className="text-xs text-muted-foreground">
                        Last contact: {formatDateLastContact(database.lastContact)}
                    </div>
                </div>
            </div>

            <div className="flex items-center px-4">
                <ConnectionCircle date={database.lastContact} />
            </div>
        </Card>
    );
};
