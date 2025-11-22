import { Text } from "@react-email/components";
import * as React from "react";
import EmailLayout from "./email-layout";

export const EmailSettingsTest = () => {
    return (
        <EmailLayout preview="Email Setup">
            <Text className="text-base font-light leading-8 text-green-800 ">Hi, your email settings are setup !</Text>
            <Text className="text-base font-light leading-8 text-green-800 ">Best regard,</Text>{" "}
            <Text className="text-base font-light leading-8 text-green-800 ">Portabase</Text>
        </EmailLayout>
    );
};

export default EmailSettingsTest;
