"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import {ProjectWith} from "@/db/schema/05_project";

export type projectCardProps = {
    data: ProjectWith;
    organizationSlug?: string;
};

export const ProjectCard = (props: projectCardProps) => {
    const { data: project, organizationSlug } = props;

    return (
        <Link
            href={`/dashboard/projects/${project.id}`}
            className="block transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
        >
            <Card className="flex flex-row justify-between">
                <div className="flex-1 text-left">
                    <CardHeader className="text-2xl font-bold">
                        {project.name}
                    </CardHeader>
                    <CardContent>{project.databases.length} databases</CardContent>
                </div>
            </Card>
        </Link>
    );
};
