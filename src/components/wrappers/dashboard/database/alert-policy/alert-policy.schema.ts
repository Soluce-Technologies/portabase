import {z} from "zod";


export const AlertPolicySchema =
    z.object({
            notificationChannelId: z.string().min(1, "Please select a notification channel"),
            eventKinds: z.enum(['error_backup', 'error_restore', 'success_restore', 'success_backup', 'weekly_report']).array().nonempty(),
        }
    )

export const AlertPoliciesSchema = z.object({
    alertPolicies: z.array(AlertPolicySchema)
});


export type AlertPoliciesType = z.infer<typeof AlertPoliciesSchema>;
export type AlertPolicyType = z.infer<typeof AlertPolicySchema>;


export const EVENT_KIND_OPTIONS = [
    {label: "Error Backup", value: "error_backup"},
    {label: "Error Restore", value: "error_restore"},
    {label: "Success Restore", value: "success_restore"},
    {label: "Success Backup", value: "success_backup"},
    {label: "Weekly Report", value: "weekly_report"},
];