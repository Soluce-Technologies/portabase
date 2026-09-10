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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

    // The [section] header is the remote name, and most pastes define exactly
    // one. Fill it in rather than making the user pick from a list of one; the
    // dropdown below only earns its keep for chained configs.
    const soleRemote = remotes.length === 1 ? remotes[0] : null;
    useEffect(() => {
        if (soleRemote && remoteName !== soleRemote) {
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
                    <FormItem>
                        <FormLabel>rclone config *</FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                value={field.value ?? ""}
                                rows={10}
                                className="font-mono text-xs"
                                placeholder={CONFIG_PLACEHOLDER}
                            />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                            Paste one or more sections from your rclone.conf. Chained remotes
                            (crypt over s3, for example) work — include every section they need.
                        </p>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="config.remoteName"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Remote *</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value ?? ""}
                            disabled={remotes.length === 0}
                        >
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            remotes.length === 0
                                                ? "Paste a config first"
                                                : "Select a remote"
                                        }
                                    />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {remotes.map((remote) => (
                                    <SelectItem key={remote} value={remote}>
                                        {remote}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            The <code>[section]</code> header to upload to. Filled in
                            automatically when the config defines only one.
                        </p>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="config.remotePath"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Remote path</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                value={field.value ?? ""}
                                placeholder="e.g. my-bucket"
                            />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                            Optional prefix, so you can point at storage already used for
                            other things. Backups always go under{" "}
                            <code>backups/YYYY-MM-DD/</code> beneath it —{" "}
                            <code>my-bucket</code> becomes{" "}
                            <code>{`${remoteName || "remote"}:my-bucket/backups/…`}</code>,
                            empty becomes{" "}
                            <code>{`${remoteName || "remote"}:backups/…`}</code>. On S3-style
                            remotes the first segment is the <strong>bucket</strong>, so leaving
                            this empty targets a bucket named <code>backups</code>.
                        </p>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </>
    );
};
