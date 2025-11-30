import * as React from "react";
import EmailLayout from "./email-layout";
import {Text, Section, Button} from "@react-email/components";

export interface EmailResetPasswordProps {
    url: string;
}

export const EmailResetPassword = ({url}: EmailResetPasswordProps) => {
    return (
        <EmailLayout preview="Email for password reset of your Portabase account">
            <Text className="text-base   font-bold ">Hello !</Text>
            <Text className="text-base font-light  ">You are receiving this email because we
                received a password reset request for your account.</Text>{" "}
            <Section className="mt-[32px] mb-[32px] text-center">
                <Button
                    className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                    href={url}
                >
                    Reset Password
                </Button>
            </Section>
            <Text className="text-base font-light  ">If you did not request a password reset, no
                further action is required.</Text>
            <Text className="text-base font-light  ">Regards,<br/>Portabase</Text>
        </EmailLayout>
    );
};

export default EmailResetPassword;
