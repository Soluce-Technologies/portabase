export type RcloneConfig = {
    /** The raw rclone config file, as pasted. May hold several sections. */
    configText: string;
    /** Which section of configText is the target remote. */
    remoteName: string;
    /**
     * Optional prefix inside the remote, e.g. "my-bucket". May be empty.
     * The agent appends `backups/<date>/<file>` beneath it, so an existing
     * bucket can hold other data alongside Portabase's backups.
     */
    remotePath: string;
};
