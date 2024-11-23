import {PropsWithChildren} from "react";
import {ClipboardCopy, Copy} from "lucide-react";


export type CodeSnippetProps = PropsWithChildren<{
    code: string
}>;

export const CodeSnippet = (props: CodeSnippetProps) => {



    return (
        <div className="flex items-center space-x-4 w-full">
            <code
                className="text-xs sm:text-sm inline-flex text-left bg-gray-800 text-white rounded-lg p-4 overflow-x-auto whitespace-nowrap max-w-full"
            >
                <span className="flex-1">{props.code}</span>
            </code>
        </div>
    );
}