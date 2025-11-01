import {EmailForm} from "@/components/wrappers/dashboard/admin/tabs/admin-email-tab/email-form/email-form";
import {Send} from "lucide-react";
import {ButtonWithLoading} from "@/components/wrappers/common/button/button-with-loading";
import {useMutation} from "@tanstack/react-query";
import {sendEmail} from "@/utils/email-helper";
import {render} from "@react-email/render";
import {toast} from "sonner";
import {Setting} from "@/db/schema/01_setting";
import {EmailFormType} from "@/components/wrappers/dashboard/admin/tabs/admin-email-tab/email-form/email-form.schema";
import TestEmailSettings from "../../../../../../../emails/TestEmailSettings";

export type SettingsEmailTabProps = {
    settings: Setting;
};

export const SettingsEmailTab = (props: SettingsEmailTabProps) => {
    const mutation = useMutation({
        mutationFn: async () => {
            if (!props.settings.smtpUser || !props.settings.smtpFrom) {
                toast.error("SMTP is not configured");
                return;
            }

            const email = await sendEmail({
                to: props.settings.smtpUser,
                subject: "Portabase",
                html: await render(TestEmailSettings(), {}),
                from: props.settings.smtpFrom,
            });
            if (email.response) {
                toast.success("Test Email Successfully sent !");
            }
        },
    });

    const handleSendMailTest = async () => {
        await mutation.mutateAsync();
    };

    return (
        <div className="flex flex-col h-full  py-4">
            <div className="flex gap-4 h-fit justify-between">
                <h1>Settings for Portabase email setup</h1>
                {props.settings.smtpFrom && (
                    <ButtonWithLoading
                        isPending={mutation.isPending}
                        onClick={async () => {
                            await handleSendMailTest();
                        }}
                        icon={<Send/>}
                        size="default"
                    >Send email test</ButtonWithLoading>
                )}
            </div>
            <div className="mt-5">
                <EmailForm defaultValues={props.settings.smtpFrom ? props.settings as EmailFormType : undefined}/>
            </div>
        </div>
    );
};
