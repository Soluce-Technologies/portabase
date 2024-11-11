import {PropsWithChildren} from "react";


export type CodeSnippetProps = PropsWithChildren<{}>;

export const CodeSnippet = (props: CodeSnippetProps) => {

    return (
        <div className="prose prose-invert">
          <pre className="bg-[#1e1e1e] rounded-md p-4">
            <code className="language-javascript text-[#d4d4d4]">{`
           ${props.children}
            `}</code>
          </pre>
        </div>
    )
}