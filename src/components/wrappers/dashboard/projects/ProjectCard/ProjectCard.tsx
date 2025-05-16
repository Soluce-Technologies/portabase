"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProjectWith } from "@/db/schema";
import Link from "next/link";

export type projectCardProps = {
    data: ProjectWith;
    organizationSlug?: string;
};

export const ProjectCard = (props: projectCardProps) => {
    const { data: project, organizationSlug } = props;

    return (
        <Link href={`/dashboard/${organizationSlug}/projects/${project.id}`}>
            <Card className="flex flex-row justify-between">
                <div className="">
                    <CardHeader>{project.name}</CardHeader>
                    <CardContent>{project.databases.length} databases</CardContent>
                </div>
            </Card>
        </Link>
    );
};
