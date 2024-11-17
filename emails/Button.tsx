import {
    Button as ReactEmailButton
} from "@react-email/components";
import {ComponentPropsWithoutRef} from "react";

export const Button = (props: ComponentPropsWithoutRef<typeof ReactEmailButton>) => {
    return (
        <ReactEmailButton
            className="block w-52 rounded bg-blue-600 py-3.5 text-center text-sm font-normal text-white no-underline "
            {...props}
        />
    )
}