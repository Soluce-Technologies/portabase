import {EmailForm} from "@/components/wrappers/dashboard/admin/AdminEmailTab/EmailForm/EmailForm";
import {Settings} from "@prisma/client";
import {Send} from "lucide-react";
import {ButtonWithLoading} from "@/components/wrappers/common/button/button-with-loading";
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
                subject: "Portabase",
                html: await render(TestEmailSettings(),{})
            });
            if(email.response){
                toast.success("Test Email Successfully sent !");
            }
        }
    })



    const handleSendMailTest = async () => {
        await mutation.mutateAsync()
    }

    return (
        <div className="flex flex-col h-full  py-4">
            <div className="flex gap-4 h-fit justify-between">
                <h1>Settings for Portabase email setup</h1>
                {props.settings.smtpFrom && (
                    <ButtonWithLoading
                        isPending={mutation.isPending}
                        onClick={async () => {
                            await handleSendMailTest()
                        }}
                        icon={<Send/>}
                        text="Send email test"
                        size="default"
                    />
                )}

            </div>
            <div className="mt-5">
                <EmailForm defaultValues={props.settings.smtpFrom ? props.settings : null}/>
            </div>
        </div>
    )
}