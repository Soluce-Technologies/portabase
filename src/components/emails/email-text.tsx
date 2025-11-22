import {Text as ReactEmailText} from "@react-email/components";
import {ComponentPropsWithoutRef} from "react";

export const EmailText = (props: ComponentPropsWithoutRef<typeof ReactEmailText>) => {
    return <ReactEmailText className="text-base font-light leading-8 text-green-800 " {...props} />;
};
