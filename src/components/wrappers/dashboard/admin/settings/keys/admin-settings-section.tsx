import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Download} from "lucide-react";
import {getFileUrlPresignedLocal} from "@/features/upload/private/upload.action";
import {toast} from "sonner";

export type AdminSettingsTabProps = {};

export const AdminSettingsSection = (props: AdminSettingsTabProps) => {

    const handleDownloadKey = async () => {

        let url: string = "";
        const data = await getFileUrlPresignedLocal({dir: "private/keys/", fileName: "server_public.pem"})
        if (data?.data?.success) {
            url = data.data.value ?? "";
        } else {
            // @ts-ignore
            const errorMessage = data?.data?.actionError?.message || "Failed to get file!";
            toast.error(errorMessage);
        }
        window.open(url, "_self");
    };

    return (
        <div className="flex flex-col gap-y-4 h-full py-4">
            <Card>
                <CardHeader>
                    <CardTitle>Instance settings</CardTitle>
                    <CardDescription>Manage portabase settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Download Public Key</p>
                            <p className="text-xs text-muted-foreground">
                                Used for encrypting communications with this instance.
                            </p>
                        </div>
                        <Button onClick={handleDownloadKey} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2"/>
                            Download
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
