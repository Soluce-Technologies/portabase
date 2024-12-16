"use client";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import {ValueIcon} from "@radix-ui/react-icons";
import {Circle} from "lucide-react";
import {ConnectionCircle} from "@/components/wrappers/common/connection-circle";
import {formatDateLastContact} from "@/utils/date-formatting";

export type agentCardProps = {
    data: any
}

export const AgentCard = (props: agentCardProps) => {

    const {data: agent} = props;

    return (
        <Link href={`/dashboard/agents/${agent.id}`}>
            <Card className="flex flex-row justify-between">
                <div className="">
                    <CardHeader>{agent.name}</CardHeader>
                    <CardContent>
                        Last contact : {formatDateLastContact(agent.lastContact)}
                    </CardContent>
                </div>
                <div className="mt-3 mr-3">
                    <ConnectionCircle date={agent.lastContact}/>
                </div>
            </Card>

        </Link>
    )
}