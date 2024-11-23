"use client"
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {PropsWithChildren} from "types-react";
import {CodeSnippet} from "@/components/wrappers/CodeSnippet/CodeSnippet";
import {generateEdgeKey} from "@/utils/edge_key";
import {Copy} from "lucide-react";
import {useState} from "react";
import {CopyButton} from "@/components/wrappers/copy-button";

export type agentRegistrationDialogProps = PropsWithChildren<{}>


export function AgentModalKey(props: agentRegistrationDialogProps) {

    const edge_key = generateEdgeKey('https://ok.com', '1234567');
    const code = `EDGE_KEY = ${edge_key}`;

    return (
        <Dialog>
            <DialogTrigger asChild>
                {props.children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-full">
                <DialogHeader>
                    <DialogTitle>Agent Edge Key</DialogTitle>
                </DialogHeader>
                <div className="sm:max-w-[375px] w-full text-center">
                    <CodeSnippet
                        code={code}
                        className="w-full overflow-x-auto break-words"
                    />
                </div>
                <DialogFooter>
                    <div className="flex items-center justify-between w-full">
                        <CopyButton value={code}/>
                        <Button type="submit">Save changes</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}