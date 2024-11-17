import {EmailForm} from "@/components/wrappers/Dashboard/Settings/SettingsEmailTab/EmailForm/EmailForm";
import {Settings} from "@prisma/client";
import {Send} from "lucide-react";
import {ButtonWithLoading} from "@/components/wrappers/Button/ButtonWithLoading/ButtonWithLoading";
import {useMutation} from "@tanstack/react-query";
import {sendEmail} from "@/utils/email-helper";
import TestEmailSettings from "../../../../../../emails/TestEmailSettings";
import {render} from "@react-email/render";
import {toast} from "sonner";



export type SettingsEmailTabProps = {
    settings: Settings
}

export const SettingsEmailTab = (props: SettingsEmailTabProps) => {

    const mutation = useMutation({
        mutationFn: async () => {
            const email = await sendEmail({
                to: props.settings.smtpUser,
                subject: "Portabase email test !",
                html: await render(TestEmailSettings(), {})
            });
            if(email.response){
                toast.success("Test Email Successfully sent !");
            }
        }
    })



    const handleSendMailTest = async () => {
        console.log("Sending email test...");
        await mutation.mutateAsync()
    }

    return (
        <div className="flex flex-col h-full  py-4">
            <div className="flex gap-4 h-fit justify-between">
                <h1>Settings for Portabase storage</h1>
                {props.settings.smtpFrom && (
                    <ButtonWithLoading
                        isPending={mutation.isPending}
                        onClick={async () => {
                            await handleSendMailTest()
                        }}
                        icon={<Send/>}
                        text="Send email test"
                    />
                )}

            </div>
            <div className="mt-5">
                <EmailForm defaultValues={props.settings.smtpFrom ? props.settings : null}/>
            </div>
        </div>
    )
}