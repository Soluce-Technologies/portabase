"use client";
import {PasswordInput} from "@/components/wrappers/auth/password-input/password-input";
import {useState} from "react";
import {CopyButton} from "@/components/wrappers/common/button/copy-button";

export type AgentCardKeyProps = {
    edgeKey: string;
};

export const AgentCardKey = ({edgeKey}: AgentCardKeyProps) => {
    const [code, setCode] = useState<string>(`${edgeKey}`);
    return (
        <>
            <PasswordInput
                value={code}
                onChange={() => {
                    setCode(edgeKey);
                }}
            />
            <CopyButton className="mt-5" value={code}/>
        </>
    );
};
