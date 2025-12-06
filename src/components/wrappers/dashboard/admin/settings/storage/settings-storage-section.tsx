"use client"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Info, ShieldCheck} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {StorageS3Form} from "@/components/wrappers/dashboard/admin/settings/storage/storage-s3/storage-s3-form";
import {useState} from "react";
import {ButtonWithLoading} from "@/components/wrappers/common/button/button-with-loading";
import {useMutation} from "@tanstack/react-query";
import {checkConnexionToS3} from "@/features/upload/public/upload.action";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {
    updateStorageSettingsAction
} from "@/components/wrappers/dashboard/admin/settings/storage/storage-s3/s3-form.action";
import {Setting} from "@/db/schema/01_setting";
import {S3FormType} from "@/components/wrappers/dashboard/admin/settings/storage/storage-s3/s3-form.schema";

export type SettingsStorageSectionProps = {
    settings: Setting;
};

export const SettingsStorageSection = (props: SettingsStorageSectionProps) => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async () => {
            const result = await checkConnexionToS3();
            if (result.error) {
                toast.error("An error occured during the connexion !");
            } else {
                toast.success("Connexion succeed!");
            }
        },
    });

    const [isSwitched, setIsSwitched] = useState<boolean>(props.settings.storage !== "local");

    const updateMutation = useMutation({
        mutationFn: () => updateStorageSettingsAction({name: "system", data: {storage: isSwitched ? "s3" : "local"}}),
        onSuccess: () => {
            toast.success(`Settings updated successfully.`);
            router.refresh();
        },
        onError: () => {
            toast.error(`An error occurred while updating settings information.`);
        },
    });

    const HandleSwitchStorage = async () => {
        setIsSwitched(!isSwitched);
        await updateMutation.mutateAsync();
    };

    const extractS3FormValues = (settings: Setting): S3FormType | undefined => {
        if (!settings.s3EndPointUrl) return undefined;
        return {
            s3EndPointUrl: settings.s3EndPointUrl,
            s3AccessKeyId: settings.s3AccessKeyId!,
            s3SecretAccessKey: settings.s3SecretAccessKey!,
            S3BucketName: settings.S3BucketName!,
        };
    };

    return (
        <div className="flex flex-col h-full">
            <Alert className="mt-3">
                <Info className="h-4 w-4"/>
                <AlertTitle>Informations</AlertTitle>
                <AlertDescription>
                    Actually you can only store you data in one place : s3 compatible or in local. For exemple you
                    cannot choose to store images in one place
                    and backups files in another.
                </AlertDescription>
            </Alert>
            <div className="flex flex-col h-full  py-4 ">
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="storage-mode">Storage Mode (Local/s3 compatible)</Label>
                        <Switch
                            checked={isSwitched}
                            onCheckedChange={async () => {
                                await HandleSwitchStorage();
                            }}
                            id="storage-mode"
                        />
                    </div>
                    <div>
                        <ButtonWithLoading
                            size={"default"}
                            disabled={!isSwitched}
                            isPending={mutation.isPending}
                            onClick={async () => {
                                await mutation.mutateAsync();
                            }}
                            icon={<ShieldCheck/>}>Test connexion</ButtonWithLoading>
                    </div>
                </div>
                {isSwitched && (
                    <div className="mt-5">
                        <StorageS3Form defaultValues={extractS3FormValues(props.settings)}/>
                    </div>
                )}
            </div>
        </div>
    );
};
