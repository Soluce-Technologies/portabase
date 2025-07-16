"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConnectionCircle } from "@/components/wrappers/common/connection-circle";
import { formatDateLastContact } from "@/utils/date-formatting";
import {Database} from "@/db/schema/06_database";

export type projectDatabaseCardProps = {
    data: Database;
    extendedProps: any;
    organizationSlug: string;
};

export const ProjectDatabaseCard = (props: projectDatabaseCardProps) => {
    const { organizationSlug, data: database, extendedProps: extendedProps } = props;

    return (
        <Link href={`/dashboard/projects/${extendedProps.id}/database/${database.id}`}>
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
            <div className="flex flex-row items-center gap-2">
                <Image src="/PostgreSQL.png" alt="Database type Icon" width={60} height={60} className="object-cover ml-4" />
                <div>
                    <CardHeader>Name : {database.name}</CardHeader>
                    <CardContent>Last contact: {formatDateLastContact(database.lastContact)}</CardContent>
                </div>
            </div>
            <div className="mt-3 mr-3">
                <ConnectionCircle date={database.lastContact} />
            </div>
        </Card>
    );
};
