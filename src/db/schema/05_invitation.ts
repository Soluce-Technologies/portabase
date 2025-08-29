import {relations} from "drizzle-orm";
import {user} from "@/db/schema/02_user";
import {organization} from "@/db/schema/03_organization";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";
import {pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {timestamps} from "@/db/schema/00_common";


export const invitation = pgTable("invitation", {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
        .notNull()
        .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    status: text("status").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    inviterId: uuid("inviter_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps
});



export const invitationRelations = relations(invitation, ({ one }) => ({
    organization: one(organization, {
        fields: [invitation.organizationId],
        references: [organization.id],
    }),
    inviter: one(user, {
        fields: [invitation.inviterId],
        references: [user.id],
    }),
}));



export const organizationInvitationSchema = createSelectSchema(invitation);
export type OrganizationInvitation = z.infer<typeof organizationInvitationSchema>;
