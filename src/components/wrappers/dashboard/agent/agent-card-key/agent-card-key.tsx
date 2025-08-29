"use client";
import {generateEdgeKey} from "@/utils/edge_key";
import {getServerUrl} from "@/utils/get-server-url";
import {PasswordInput} from "@/components/wrappers/auth/password-input/password-input";
import {useState} from "react";
import {CopyButton} from "@/components/wrappers/common/button/copy-button";
import {Agent} from "@/db/schema/08_agent";

export type AgentCardKeyProps = {
    agent: Agent;
};

export const AgentCardKey = (props: AgentCardKeyProps) => {
    const edge_key = generateEdgeKey(getServerUrl(), props.agent.id);
    const [code, setCode] = useState<string>(`${edge_key}`);

    return (
        <>
            <PasswordInput
                value={code}
                onChange={() => {
                    setCode(edge_key);
                }}
            />
            <CopyButton className="mt-5" value={code}/>
        </>
    );
};
