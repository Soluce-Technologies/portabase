"use client";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";

export type projectCardProps = {
    data: any
}

export const ProjectCard = (props: projectCardProps) => {

    const {data: project} = props;

    return (
        <Link href={`/dashboard/projects/${project.id}`}>
            <Card className="flex flex-row justify-between">
                <div className="">
                    <CardHeader>{project.name}</CardHeader>
                    <CardContent>
                    </CardContent>
                </div>
            </Card>

        </Link>
    )
}