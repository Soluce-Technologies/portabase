import {
    Text,
} from "@react-email/components";
import * as React from "react";
import EmailLayout from "./EmailLayout";
import {Button} from "@react-email/button";


export const TestEmailSettings = () => {
    return (
        <EmailLayout
            preview="Email Setup"
        >

            <Text
                className="text-base font-light leading-8 text-green-800 "

            >
                Hi, your email settings are setup !
            </Text>


            <Text
                className="text-base font-light leading-8 text-green-800 "

            >
                Best regard,
            </Text>            <Text
            className="text-base font-light leading-8 text-green-800 "

        >
            Portabase
        </Text>

        </EmailLayout>
    );
};




export default TestEmailSettings;
