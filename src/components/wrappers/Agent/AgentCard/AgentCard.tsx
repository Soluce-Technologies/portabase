"use client";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";

export type agentCardProps = {
    id: string;
    name: string;
    lastContact: string;
}

export const AgentCard = (props: agentCardProps) => {

    const {id, name, lastContact} = props;

    return (
        <Link href={`/dashboard/agents/${id}`}>
            <Card>
                <CardHeader>{name}</CardHeader>
                <CardContent>Agent's Description</CardContent>
            </Card>
        </Link>
    )
}