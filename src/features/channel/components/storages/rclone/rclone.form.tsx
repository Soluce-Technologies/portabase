import {useEffect} from "react";
import {UseFormReturn} from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {Textarea} from "@/components/ui/textarea";
import {parseRemoteNames} from "@/features/channel/components/storages/rclone/rclone.parse";

type StorageRcloneFormProps = {
    form: UseFormReturn<any, any, any>;
};

const CONFIG_PLACEHOLDER = `[ovhcloud-rbx]
type = s3
provider = OVHcloud
access_key_id = my_access
secret_access_key = my_secret
region = rbx
endpoint = s3.rbx.io.cloud.ovh.net
acl = private`;

export const StorageRcloneForm = ({form}: StorageRcloneFormProps) => {
    const configText: string = form.watch("config.configText") ?? "";
    const remoteName: string = form.watch("config.remoteName") ?? "";
    const remotes = parseRemoteNames(configText);

    // Exactly one section is allowed, so the remote name is derived from the
    // header rather than chosen. Mirror it into form state, and clear it when
    // the paste is not a single valid section so no stale name is submitted.
    const soleRemote = remotes.length === 1 ? remotes[0] : "";
    useEffect(() => {
        if (remoteName !== soleRemote) {
            form.setValue("config.remoteName", soleRemote, {shouldValidate: true});
        }
    }, [soleRemote, remoteName, form]);

    return (
        <>
            <Separator className="my-1"/>
            <FormField
                control={form.control}
                name="config.configText"
                render={({field}) => (
                    <FormItem className="min-w-0">
                        <FormLabel>rclone config *</FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                value={field.value ?? ""}
                                rows={10}
                                className="font-mono text-xs w-full break-all"
                                placeholder={CONFIG_PLACEHOLDER}
                            />
                        </FormControl>
                        <p className="text-xs text-muted-foreground break-words">
                            Paste exactly one <code className="break-all">[section]</code> from your rclone.conf.
                            The section header names the remote.
                        </p>
                        {soleRemote ? (
                            <p className="text-xs text-muted-foreground break-words">
                                Remote detected: <code className="break-all">{soleRemote}</code>
                            </p>
                        ) : null}
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="config.remotePath"
                render={({field}) => (
                    <FormItem className="min-w-0">
                        <FormLabel>Remote path</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                value={field.value ?? ""}
                                placeholder="e.g. my-bucket"
                            />
                        </FormControl>
                        <p className="text-xs text-muted-foreground break-words">
                            Optional prefix, so you can point at storage already used for
                            other things. Backups always go under{" "}
                            <code className="break-all">backups/YYYY-MM-DD/</code> beneath it —{" "}
                            <code className="break-all">my-bucket</code> becomes{" "}
                            <code className="break-all">{`${remoteName || "remote"}:my-bucket/backups/…`}</code>,
                            empty becomes{" "}
                            <code className="break-all">{`${remoteName || "remote"}:backups/…`}</code>. On S3-style
                            remotes the first segment is the <strong>bucket</strong>, so leaving
                            this empty targets a bucket named <code className="break-all">backups</code>.
                        </p>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </>
    );
};
