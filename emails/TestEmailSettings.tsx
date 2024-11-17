import {
    Text,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./EmailLayout";


export const TestEmailSettings = () => {
    return (
        <EmailLayout
            preview="Test Email"
        >
            <Text
                className="text-base font-light leading-8 text-green-800 "
            >
                Hi, this is a test email for settings and alerts !
            </Text>
            <Text
                className="text-base font-light leading-8 text-green-800 ">
                Soluce Technologies | Portabase
            </Text>
        </EmailLayout>
    );
};



export default TestEmailSettings;
