import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Info, Send, ShieldCheck} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {StorageS3Form} from "@/components/wrappers/Dashboard/Settings/SettingsStorageTab/StorageS3Form/StorageS3Form";
import {useState} from "react";
import {Settings} from "@prisma/client";
import {ButtonWithLoading} from "@/components/wrappers/Button/ButtonWithLoading/ButtonWithLoading";
import {useMutation} from "@tanstack/react-query";
import {checkConnexionToS3} from "@/features/upload/upload.action";
import {toast} from "sonner";


export type SettingsStorageTabProps = {
    settings: Settings
}

export const SettingsStorageTab = (props: SettingsStorageTabProps) => {

    const mutation = useMutation({
        mutationFn: async () => {
            const result = await checkConnexionToS3()
            if(result.error){
                toast.error("An error occured during the connexion !")
            }
            toast.success("Connexion succeed!")
        }
    })

    const [isSwitched, setIsSwitched] = useState<boolean>(props.settings.storage !== "local");


    return (
        <div className="flex flex-col h-full  py-4">
            <h1>Settings for Portabase storage</h1>
            <Alert className="mt-3">
                <Info className="h-4 w-4"/>
                <AlertTitle>Informations</AlertTitle>
                <AlertDescription>
                    Actually you can only store you data in one place : s3 compatible or in local.
                    For exemple you cannot choose to store images in one place and .dump files in another.
                </AlertDescription>
            </Alert>
            <div className="flex flex-col h-full  py-4 ">
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                    <Label htmlFor="storage-mode">Storage Mode (Local/s3 compatible)</Label>
                    <Switch
                        checked={isSwitched}
                        onCheckedChange={() => {
                            setIsSwitched(!isSwitched);
                        }}
                        id="storage-mode"/>
                    </div>
                    <div>
                        <ButtonWithLoading
                            disabled={!isSwitched}
                            isPending={mutation.isPending}
                            onClick={async () => {
                                await mutation.mutateAsync()
                            }}
                            icon={<ShieldCheck />}
                            text="Test connexion"
                        />
                    </div>
                </div>
                {isSwitched && (
                    <div className="mt-5">
                        <StorageS3Form defaultValues={props.settings.s3EndPointUrl ? props.settings : null}/>
                    </div>
                )}
            </div>
        </div>
    )
}