"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { formatDateLastContact } from "@/utils/date-formatting";
import { ConnectionCircle } from "@/components/wrappers/common/connection-circle";
import {Agent} from "@/db/schema/07_agent";

export type agentCardProps = {
    data: Agent;
};

export const AgentCard = (props: agentCardProps) => {
    const { data: agent } = props;

    return (
        <Link href={`/dashboard/agents/${agent.id}`} className="block transition-all duration-200 hover:scale-[1.01] hover:shadow-md">
            <Card className="flex flex-row justify-between">
                <div className="flex-1 text-left">
                    <CardHeader className="text-2xl font-bold">{agent.name}</CardHeader>
                    <CardContent>Last contact: {formatDateLastContact(agent.lastContact)}</CardContent>
                </div>
                <div className="flex items-center px-4">
                    <ConnectionCircle date={agent.lastContact} />
                </div>
            </Card>
        </Link>
    );
};
