import {PropsWithChildren} from "react";
import {ClipboardCopy, Copy, CopyIcon} from "lucide-react";
import {Button} from "@/components/ui/button"

export type CodeSnippetProps = PropsWithChildren<{
    code: string
}>;

export const CodeSnippet = (props: CodeSnippetProps) => {



    return (
        // <div className="flex items-center space-x-4 w-full">
        //     <code
        //         className="text-xs sm:text-sm inline-flex text-left bg-gray-800 text-white rounded-lg p-4 overflow-x-auto whitespace-nowrap max-w-full"
        //     >
        //         <span className="flex-1">{props.code}</span>
        //     </code>
        // </div>
        <div className="rounded-lg border bg-background">
            <div className="flex items-center justify-between border-b bg-muted px-4 py-2">
                <div className="text-sm font-medium">.env</div>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50 text-muted-foreground">
                    {/*<CopyIcon className="h-4 w-4"/>*/}
                    {/*<span className="sr-only">Copy code</span>*/}
                </Button>
            </div>
            <div className="p-4 font-mono text-sm leading-6 text-foreground truncate">
        <pre className="language-javascript overflow-x-auto">
          <code className="mb-6">{props.code}</code>
        </pre>
            </div>
        </div>
    );
}