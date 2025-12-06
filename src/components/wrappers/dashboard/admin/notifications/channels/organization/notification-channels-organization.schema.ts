import {z} from "zod";

export const NotificationChannelsOrganizationSchema = z.object({
    organizations: z.array(z.string())
});

export type NotificationChannelsOrganizationType = z.infer<typeof NotificationChannelsOrganizationSchema>;
