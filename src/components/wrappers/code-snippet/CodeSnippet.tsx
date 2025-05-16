import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";

export type CodeSnippetProps = PropsWithChildren<{
    code: string;
}>;

export const CodeSnippet = (props: CodeSnippetProps) => {
    return (
        <div className="rounded-lg border bg-background">
            <div className="flex items-center justify-between border-b bg-muted px-4 py-2">
                <div className="text-sm font-medium">.env</div>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 text-muted-foreground"></Button>
            </div>
            <div className="p-4 font-mono text-sm leading-6 text-foreground truncate">
                <pre className="language-javascript overflow-x-auto">
                    <code className="mb-6">{props.code}</code>
                </pre>
            </div>
        </div>
    );
};
