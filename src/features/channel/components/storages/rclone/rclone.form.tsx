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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {Info} from "lucide-react";
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
    // Shown inside the remote-path tooltip examples.
    const remote = remoteName || "remote";
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
                        <FormLabel className="flex items-center gap-1.5">
                            Remote path
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        aria-label="About the remote path"
                                        className="text-muted-foreground hover:text-foreground focus-visible:outline-none"
                                    >
                                        <Info className="h-3.5 w-3.5"/>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    className="max-w-xs space-y-1.5 text-xs text-left"
                                >
                                    <p>
                                        Optional prefix, so you can point at storage already
                                        used for other things.
                                    </p>
                                    <p>
                                        Backups always go under{" "}
                                        <code className="break-all">backups/YYYY-MM-DD/</code>{" "}
                                        beneath it — <code className="break-all">my-bucket</code>{" "}
                                        becomes{" "}
                                        <code className="break-all">{`${remote}:my-bucket/backups/…`}</code>,
                                        empty becomes{" "}
                                        <code className="break-all">{`${remote}:backups/…`}</code>.
                                    </p>
                                    <p>
                                        On S3-style remotes the first segment is the{" "}
                                        <strong>bucket</strong>, so leaving this empty targets a
                                        bucket named <code className="break-all">backups</code>.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                value={field.value ?? ""}
                                placeholder="e.g. my-bucket"
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </>
    );
};
